const fs = require('fs');
const imagekit = require('../configs/imageKit.config.js');
const { sequelize } = require('../models');
const { QueryTypes } = require("sequelize");

const ImageController = {
    async uploadImage(req, res) {
        const fileStream = fs.createReadStream(req.file.path);
        const companyId = req.account.companyId;
        const userId = req.account.userId;
        const role = req.account.role;
        imagekit.upload({
            file: fileStream,
            fileName: req.file.originalname
        }, async function (error, result) {
            if (error) res.send(error);
            else {
                if (role == 'Người tìm việc') {
                    try {
                        await sequelize.query(
                            `update users set avatar = '${result.url}' where id = ${userId}`,
                            { type: QueryTypes.UPDATE });
                        res.status(200).send({avatar: result.url})
                    } catch (e) {
                        res.status(500).send({ message: e });
                    }
                } else {
                    try {
                        await sequelize.query(
                            `update companies set companyLogo = '${result.url}' where id = ${companyId}`,
                            { type: QueryTypes.UPDATE });
                        res.status(200).send({avatar: result.url})
                    } catch (e) {
                        res.status(500).send({ message: e });
                    }
                }
            }
        })
    }
}

module.exports = ImageController;