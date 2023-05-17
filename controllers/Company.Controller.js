const db = require('../models/index.js');
const { sequelize } = require("../models");
const bcrypt = require('bcrypt');
const { Op, QueryTypes } = require('sequelize');
const generateToken = require('../utils/generateToken.js');

const CompanyController = {
    async getAllCompany(req, res) {
        try {
            const result = await db.companies.findAll();
            res.status(200).send(result);
        } catch (e) {
            res.status(500).send({ message: e });
        }
    },

    async getCompanyProfile(req, res) {
        let company = await db.companies.findOne({
            where: {
                id: req.account.companyId
            }
        })
        res.status(200).send(company);
    },

    async createJob(req, res) {
        const companyId = req.account.companyId;
        const data = req.body;
        if (!data.job_name || !data.category || !data.location || !data.jobType || !data.numberNeeded
            || !data.position || !data.job_description || !data.job_requirement || !data.job_benefit) {
            res.status(400).send({
                message: "Content can't be empty!"
            });
            return;
        }
        try {
            const Job = {
                job_name: data.job_name,
                location: data.location,
                salaryFrom: data.salaryFrom,
                salaryTo: data.salaryTo,
                jobType: data.jobType,
                numberNeeded: data.numberNeeded,
                position: data.position,
                job_description: data.job_description,
                job_requirement: data.job_requirement,
                job_benefit: data.job_benefit,
                companyId: companyId,
                categoryId: data.category
            };

            await db.jobs.create(Job);
            res.status(201).send({ message: 'Create job successfully!' });
        } catch (err) {
            res.status(500).send({ message: `${err}` });
        }
    },

    async getJobs(req, res) {
        const limit = req.query.limit;
        try {
            let query = `select * from jobs where companyId = ${req.account.companyId}`;
            if (limit && limit > 0) query += `\nlimit ${limit}`;
            const result = await sequelize.query(
                query, { type: QueryTypes.SELECT }
            );
            res.status(200).send(result);
        } catch (e) {
            res.status(500).send({ message: e });
        }
    },

    async updateJob(req, res) {
        const updateData = req.body;
        if (!updateData.job_name || !updateData.category || !updateData.location || !updateData.jobType
            || !updateData.numberNeeded || !updateData.position || !updateData.job_description
            || !updateData.job_requirement || !updateData.job_benefit) {
            res.status(400).send({
                message: "Content can't be empty!"
            });
            return;
        }
        try {
            await db.jobs.update(
                {
                    job_name: updateData.job_name,
                    location: updateData.location,
                    salaryFrom: updateData.salaryFrom,
                    salaryTo: updateData.salaryTo,
                    jobType: updateData.jobType,
                    numberNeeded: updateData.numberNeeded,
                    position: updateData.position,
                    job_description: updateData.job_description,
                    job_requirement: updateData.job_requirement,
                    job_benefit: updateData.job_benefit,
                    categoryId: updateData.category
                },
                {
                    where: {
                        id: updateData.id
                    }
                }
            );
            res.status(201).send({ message: 'Update jobs successfully!' });
        } catch (e) {
            res.status(500).send({ message: e });
        }
    },

    async approveJob(req, res) {
        const data = req.body;
        if (!data.status || !data.message) {
            res.status(400).send({
                message: "Content can't be empty!"
            });
            return;
        }
        try {
            await db.applications.update(
                {
                    status: data.status,
                    message: data.message
                },
                {
                    where: {
                        jobId: data.jobId,
                        userId: data.userId
                    }
                }
            );
            res.status(201).send({ message: 'Update application successfully!' });
        } catch (e) {
            res.status(500).send({ message: e });
        }
    },

    async getApplicants(req, res) {
        const jobId = req.query.jobId;

        try {
            let query = `select u.*, a.cvId as cvId from users as u
            inner join applications as a on a.userId = u.id
            inner join jobs as j on j.id = a.jobId
            where jobId = ${jobId}`;
            const result = await sequelize.query(
                query, { type: QueryTypes.SELECT }
            );
            res.status(200).send(result);
        } catch (e) {
            res.status(500).send({ message: e });
        }
    },

    async updateCompany(req, res) {
        const currentID = req.user.id;
        const updateData = req.body;
        if (!updateData.name || !updateData.address || !updateData.employees || !updateData.description) {
            res.status(400).send({ message: "Content can't be empty!" });
            return;
        }

        let findInDB = await db.users.findAll({
            where: {
                [Op.or]: [{ name: updateData.name }, { email: updateData.email }]
            }
        });

        if (findInDB.length != 0) {
            res.status(406).send({ message: "Can't update infomation because the given information is already exist!" });
        } else {
            try {
                await db.users.update(
                    {
                        name: updateData.name,
                        email: updateData.email,
                        phoneNumber: updateData.phoneNumber,
                        address: updateData.address
                    },
                    {
                        where: {
                            id: currentID
                        }
                    }
                );
                res.status(201).send({ message: 'Update user successfully!' });
            } catch (e) {
                res.status(500).send({ message: e });
            }
        }
    },

    async getNotification(req, res) {
        try {
            const query = `select u.id as userId, u.first_name, u.last_name , u.avatar, 
            a.jobId, a.cvId, j.job_name  
            from applications as a 
            inner join jobs as j on a.jobId = j.id
            inner join users as u on a.userId = u.id
            where j.companyId = ${req.account.companyId} and a.status = 'Chờ kết quả';`
            const result = await sequelize.query(
                query, { type: QueryTypes.SELECT }
            );
            res.status(200).send(result);
        } catch (e) {
            res.status(500).send({ message: e });
        }
    }
}

module.exports = CompanyController;