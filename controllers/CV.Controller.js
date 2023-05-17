const { QueryTypes } = require("sequelize");
const { sequelize } = require("../models");
const db = require("../models");
const fs = require('fs');


const CVController = {
    async getAllCV(req, res) {
        try {
            const result = await db.cv.findAll({
                where: {
                    userId: req.account.userId
                }
            });
            res.status(200).send(result);
        } catch (e) {
            res.status(500).send({ message: e });
        }
    },

    async getCVFile(req, res) {
        const cvId = req.query.id;
        try {
            const result = await db.cv.findOne({
                where: {
                    id: cvId
                }
            });
            res.status(200).send(result.file);
        } catch (e) {
            res.status(500).send({ message: e });
        }
    },

    async createCV(req, res) {
        const userId = req.account.userId;
        const file = req.file;
        const data = req.body;

        if (!data.title || !file) {
            res.status(400).send({
                message: "Content can't be empty!"
            });
            return;
        }
        const binaryData = fs.readFileSync(file.path);
        const base64Data = Buffer.from(binaryData).toString('base64');
        try {
            const CV = await db.cv.create({
                title: data.title,
                file: base64Data,
                userId: userId
            });
            res.status(201).send({ cv: CV });
        } catch (err) {
            res.status(500).send({ message: `${err}` });
        }
    },
};

module.exports = CVController;