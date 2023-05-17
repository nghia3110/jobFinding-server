const express = require('express');
const upload = require('../configs/multer.config');
const verifyToken = require('../middleware/AuthMiddleware');

const router = express.Router();
const ImageController = require('../controllers/Image.Controller');

router.post('/upload-image', verifyToken, upload.single('file'), ImageController.uploadImage);

module.exports = router;