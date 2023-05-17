const express = require('express');
const verifyToken = require('../middleware/AuthMiddleware');
const upload = require('../configs/multer.config');

const router = express.Router();
const CVController = require('../controllers/CV.Controller');

router.get('/get-all', verifyToken, CVController.getAllCV);
router.get('/get-cv-file/:id?', CVController.getCVFile);
router.post('/createCV', verifyToken, upload.single('file') , CVController.createCV);

module.exports = router;