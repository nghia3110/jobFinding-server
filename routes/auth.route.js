const express = require('express');

const router = express.Router();
const AuthController = require('../controllers/Auth.Controller')

router.post('/login', AuthController.login);
router.post('/registerUser', AuthController.registerUser);
router.post('/registerCompany', AuthController.registerCompany);


module.exports = router;