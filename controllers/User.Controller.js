const db = require('../models/index.js');
const { sequelize } = require("../models");
const { Op, QueryTypes } = require('sequelize');
const fs = require('fs');

const UserController = {
    async getUserProfile(req, res) {
        let user = await db.users.findOne({
            where: {
                id: req.account.userId
            }
        })
        res.status(200).send(user);
    },

    async updateUser(req, res) {
        const currentID = req.account.userId;
        const updateData = req.body;
        if (!updateData.first_name || !updateData.last_name ||
            !updateData.dob || !updateData.address || !updateData.phone) {
            res.status(400).send({ message: "Content can't be empty!" });
            return;
        }

        if (updateData.email !== '') {
            let findInDB = await db.accounts.findAll({
                where: {
                    [Op.or]: [{ email: updateData.email }]
                }
            });

            if (findInDB.length != 0) {
                res.status(406).send({ message: "Can't update infomation because the given information is already exist!" });
            } else {
                try {
                    const user = {
                        first_name: updateData.first_name,
                        last_name: updateData.last_name,
                        phone: updateData.phone,
                        address: updateData.address,
                        dob: updateData.dob
                    }
                    await db.users.update(
                        user,
                        {
                            where: {
                                id: currentID
                            }
                        }
                    );
                    const account = {
                        email: updateData.email
                    }
                    await db.accounts.update(
                        account,
                        {
                            where: {
                                userId: currentID
                            }
                        }
                    )
                    res.status(201).send({ user: user }, { account: account });
                } catch (e) {
                    res.status(500).send({ message: e });
                }
            }
        } else {
            try {
                const user = {
                    first_name: updateData.first_name,
                    last_name: updateData.last_name,
                    phone: updateData.phone,
                    address: updateData.address,
                    dob: updateData.dob
                }
                await db.users.update(
                    user,
                    {
                        where: {
                            id: currentID
                        }
                    }
                );
                res.status(201).send({ user: user });
            } catch (e) {
                res.status(500).send({ message: e });
            }
        }
    },

    async applyJob(req, res) {
        const userId = req.account.userId;
        let cv = req.file;
        let data = req.body;
        if (!cv && !data) {
            res.status(400).send({ message: "Content can't be empty!" });
            return;
        }
        if (cv) {
            const binaryData = fs.readFileSync(cv.path);
            const base64Data = Buffer.from(binaryData).toString('base64');
            try {
                const CV = await db.cv.create({
                    title: data.title.substr(0, data.title.length - 4),
                    file: base64Data,
                    userId: userId
                });
                const application = await db.applications.create({
                    status: 'Chờ kết quả',
                    description: data.description,
                    cvId: CV.id,
                    jobId: data.jobId,
                    userId: userId
                });
                res.status(201).send(application);
            } catch (err) {
                res.status(500).send({ message: `${err}` });
            }
        } else {
            let result = await db.cv.findOne({
                where: {
                    title: data.title
                }
            });

            if (result) {
                try {
                    await db.applications.create({
                        status: 'Chờ kết quả',
                        description: data.description,
                        cvId: result.id,
                        jobId: data.jobId,
                        userId: userId
                    })
                    res.status(201).send({ message: 'Create application successfully!' });
                } catch (e) {
                    res.status(500).send({ message: `${err}` });
                }
            }
        }
    },

    async getAppliedJobs(req, res) {
        try {
            let appliedJobs = await sequelize.query(
                `select j.*, a.status as status, a.jobId as jobId, a.message as message,
                c.companyName as companyName,
                c.companyLogo as companyLogo from applications as a
                inner join jobs as j on j.id = a.jobId
                inner join companies as c on c.id = j.companyId
                where a.userId = ${req.account.userId}`,
                { type: QueryTypes.SELECT });
            res.status(200).send(appliedJobs);
        } catch (e) {
            res.status(500).send({ message: e });
        }

    },

    async updateProfile(req, res) {
        const { education, experience, skill } = req.body;
        if (!education && !experience && !skill) {
            res.status(400).send({ message: "Error!" });
            return;
        }
        const user = await db.users.findOne({
            where: {
                id: req.account.userId
            }
        })
        try {
            if (education) {
                let educationArray = user.education || [];

                const educationIndex = educationArray.findIndex(item => item.id === education.id);

                if (educationIndex === -1) {
                    educationArray.push(education);
                }
                else {
                    educationArray[educationIndex] = { id: education.id, ...education };
                }
                await db.users.update(
                    {
                        education: educationArray
                    },
                    {
                        where: {
                            id: user.id
                        }
                    }
                );
                res.status(200).send({ education: educationArray });
            }
            if (experience) {
                let experienceArray = user.experience || [];

                const experienceIndex = experienceArray.findIndex(item => item.id === experience.id);

                if (experienceIndex === -1) {
                    experienceArray.push(experience);
                }
                else {
                    experienceArray[experienceIndex] = { id: experience.id, ...experience };
                }
                await db.users.update(
                    {
                        experience: experienceArray
                    },
                    {
                        where: {
                            id: user.id
                        }
                    }
                );
                res.status(200).send({ experience: experienceArray });
            }
            if (skill) {
                let skillArray = user.skill || [];

                const skillIndex = skillArray.findIndex(item => item.id === skill.id);

                if (skillIndex === -1) {
                    skillArray.push(skill);
                }
                else {
                    skillArray[skillIndex] = { id: skill.id, ...skill };
                }
                await db.users.update(
                    {
                        skill: skillArray
                    },
                    {
                        where: {
                            id: user.id
                        }
                    }
                );
                res.status(200).send({ skill: skillArray });
            }
        } catch (e) {
            res.status(500).send({ message: e })
        }
    },

    async deleteProfile(req, res) {
        const { type, id } = req.body;
        if (!type && !id) {
            res.status(400).send({ message: "Error!" });
            return;
        }
        const user = await db.users.findOne({
            where: {
                id: req.account.userId
            }
        })
        if (type === 'education') {
            let educationArray = user.education;
            const educationIndex = educationArray.findIndex(item => item.id === id);
            educationArray.splice(educationIndex, 1);
            if (educationArray.length == 0) educationArray = null;
            await db.users.update(
                {
                    education: educationArray
                },
                {
                    where: {
                        id: user.id
                    }
                }
            );
            res.status(200).send({ education: educationArray });
        }
        if (type === 'experience') {
            let experienceArray = user.experience;
            const experienceIndex = experienceArray.findIndex(item => item.id === id);
            experienceArray.splice(experienceIndex, 1);
            if (experienceArray.length == 0) experienceArray = null;
            await db.users.update(
                {
                    experience: experienceArray
                },
                {
                    where: {
                        id: user.id
                    }
                }
            );
            res.status(200).send({ experience: experienceArray });
        }
        if (type === 'skill') {
            let skillArray = user.skill;
            const skillIndex = skillArray.findIndex(item => item.id === id);
            skillArray.splice(skillIndex, 1);
            if (skillArray.length == 0) skillArray = null;
            await db.users.update(
                {
                    skill: skillArray
                },
                {
                    where: {
                        id: user.id
                    }
                }
            );

            res.status(200).send({ skill: skillArray });
        }
    }
}

module.exports = UserController;