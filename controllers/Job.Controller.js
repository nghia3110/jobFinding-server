const { QueryTypes } = require("sequelize");
const { sequelize } = require("../models");
const db = require("../models");
const fs = require('fs');

const JobController = {
    async getAllJob(req, res) {
        try {
            const result = await sequelize.query(
                `select j.*, c.companyName as companyName,
                c.companyLogo as companyLogo
                from jobs as j
                inner join companies as c on j.companyId = c.id
                order by rand()`,
                { type: QueryTypes.SELECT });
            res.status(200).send(result);
        } catch (e) {
            res.status(500).send({ message: e });
        }
    },
    async getRecommendJob(req, res) {
        try {
            const result = await sequelize.query(
                `select j.*, c.companyName as companyName, c.companyLogo as companyLogo 
                from jobs as j
                inner join companies as c on c.id = j.companyId 
                order by rand() 
                limit 5`, { type: QueryTypes.SELECT });
            res.status(200).send(result);
        } catch (e) {
            res.status(500).send({ message: e });
        }
    },

    async getJobDetail(req, res) {
        const jobId = req.params.id;
        const userId = req.query.userId;
        try {
            const result = await sequelize.query(
                `select j.*, c.companyName as companyName, c.description as companyDescription,
                c.companyLogo as companyLogo, 
                (select status from applications where jobId = ${jobId} and userId = ${userId}) as status
                from jobs as j
                inner join companies as c on j.companyId = c.id
                where j.id = ${jobId}`,
                { type: QueryTypes.SELECT });
            res.status(200).send(result[0]);
        } catch (e) {
            res.status(500).send({ message: e });
        }
    },

    async searchJob(req, res) {
        const { job_name, position, salaryFrom, salaryTo, location, category } = req.query;
        if(!job_name && !position && !salaryFrom && !salaryTo && !location && !category) {
            res.send({});
            return;
        }
        try {
            let query = `select j.*, c.companyName as companyName,
            c.companyLogo as companyLogo from jobs as j
            inner join companies as c on j.companyId = c.id
            where job_name like '%${job_name || ''}%'`;
            if(position) query += ` and position = '${position}'`;
            if(salaryFrom) query += ` and salaryFrom >= ${salaryFrom}`;
            if(salaryTo) query += ` and salaryTo <= ${salaryTo}`;
            if(location) query += ` and location = '${location}'`;
            if(category) query += `and categoryId = '${category}'`;
            const result = await db.sequelize.query(
                query,
                { type: QueryTypes.SELECT }
            );
            res.status(200).send(result);
        } catch (e) {
            res.status(500).send({message: e});
        }
    },

    async getCompanyJob(req, res) {
        const {companyId} = req.body;
        try {
            const result = await db.jobs.findAll({
                where: {
                    companyId: companyId
                }
            })
            res.status(200).send(result);
        } catch(e) {
            res.status(500).send({message: e})
        }
    }
};

module.exports = JobController;