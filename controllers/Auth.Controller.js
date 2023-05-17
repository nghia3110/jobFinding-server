const db = require('../models/index.js');
const { sequelize } = require("../models");
const bcrypt = require('bcrypt');
const { Op, QueryTypes } = require('sequelize');
const generateToken = require('../utils/generateToken.js');


const AuthController = {
    async registerUser(req, res) {
        const userData = req.body;
        if (!userData.password || !userData.first_name || !userData.last_name || !userData.phone || !userData.address || !userData.dob || !userData.email) {
            res.status(400).send({
                message: "Content can't be empty!"
            });
            return;
        }

        let findInDB = await db.accounts.findAll({
            where: {
                [Op.or]: [{ email: userData.email }]
            }
        });

        if (findInDB.length != 0) {
            res.status(406).send({ message: "There is an account registered with given information!" });
        } else {
            try {
                const hashPassword = await bcrypt.hash(userData.password, 10);

                const User = await db.users.create({
                    first_name: userData.first_name,
                    last_name: userData.last_name,
                    phone: userData.phone,
                    address: userData.address,
                    dob: userData.dob,
                    avatar: 'https://ik.imagekit.io/nghia3110/avatar.png?updatedAt=1682363952373'
                });
                const Account = {
                    password: hashPassword,
                    email: userData.email,
                    role: 'Người tìm việc',
                    userId: User.id
                };
                await db.accounts.create(Account);
                res.status(201).send({ message: 'Register Successfully!' });
            } catch (err) {
                res.status(500).send({ message: `${err}` });
            }
        }
    },

    async registerCompany(req, res) {
        const userData = req.body;
        if (!userData.password || !userData.email || !userData.companyName || !userData.address || !userData.employees || !userData.description) {
            res.status(400).send({
                message: "Content can't be empty!"
            });
            return;
        }

        let findInDB = await db.accounts.findAll({
            where: {
                [Op.or]: [{ email: userData.email }]
            }
        });

        if (findInDB.length != 0) {
            res.status(406).send({ message: "There is an account registered with given information!" });
        } else {
            try {
                const hashPassword = await bcrypt.hash(userData.password, 10);

                const Company = await db.companies.create({
                    companyName: userData.companyName,
                    address: userData.address,
                    employees: userData.employees,
                    description: userData.description,
                    companyLogo: 'https://ik.imagekit.io/nghia3110/company.jpg?updatedAt=1682386482000'
                });

                const Account = {
                    password: hashPassword,
                    email: userData.email,
                    role: 'Công ty',
                    companyId: Company.id
                };
                await db.accounts.create(Account);
                res.status(201).send({ message: 'Register Successfully!' });
            } catch (err) {
                res.status(500).send({ message: `${err}` });
            }
        }
    },

    async login(req, res) {
        const userInput = req.body;
        if (!userInput.email || !userInput.password) {
            res.status(400).send({ message: "Content can't be empty!" });
            return;
        }

        let account = await db.accounts.findOne({
            where: {
                [Op.or]: [{ email: userInput.email }]
            }
        });

        if (account) {
            const match = await bcrypt.compare(userInput.password, account.password);

            if (match) {
                let token = generateToken(account.id);
                if (account.role === 'Người tìm việc') {
                    const user = await db.users.findOne({
                        where: {
                            id: account.userId
                        }
                    })
                    res.send({
                        id: account.id,
                        email: account.email,
                        role: account.role,
                        token: token,
                        userInfo: user
                    });
                } else {
                    const company = await db.companies.findOne({
                        where: {
                            id: account.companyId
                        }
                    })
                    res.send({
                        id: account.id,
                        email: account.email,
                        role: account.role,
                        token: token,
                        companyInfo: company
                    });
                }
            } else {
                res.status(406).send({ message: "Password is not correct!" });
            }
        } else {
            res.status(406).send({ message: "Email not found!" });
        }
    }
}

module.exports = AuthController;