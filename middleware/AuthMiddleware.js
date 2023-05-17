const jwt = require('jsonwebtoken');
const db = require('../models');

const verifyToken = async (req, res, next) => {
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        try {
            var token = req.headers.authorization.split(' ')[1];
            var decoded = jwt.verify(token, process.env.JWT_SECRETKEY);
            
            req.account = await db.accounts.findOne({
                where: {
                    id: decoded.id
                }
            });
            next();
        } catch (err) {
            res.status(401).send({message: `Not authorize, token failed!`});
        }
    } else {
        res.status(401).send({message: 'Not authorize, no token found!'});
    }
}

//const verifyAdmin = async (req, res, next) => {
    /* if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        try {
            var token = req.headers.authorization.split(' ')[1];
            var decoded = jwt.verify(token, process.env.JWT_SECRETKEY);
            
            let user = await db.users.findOne({
                where: {
                    id: decoded.id
                }
            });

            if(user.role_id != 4) {
                res.status(401).send({message: "You are not admin!"});
            }
            else next();
        } catch (err) {
            res.status(401).send({message: 'Not authorize, token failed!'});
        }
    } else {
        res.status(401).send({message: 'Not authorize, no token found!'});
    } */
//}

module.exports = (verifyToken);