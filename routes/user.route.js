const express = require('express');
const upload = require('../configs/multer.config');

const router = express.Router();
const UserController = require('../controllers/User.Controller');
const verifyToken = require('../middleware/AuthMiddleware');

router.get('/profile', verifyToken , UserController.getUserProfile);
router.put('/update', verifyToken ,UserController.updateUser);
router.get('/appliedJobs', verifyToken, UserController.getAppliedJobs);
router.post('/apply-job', verifyToken, upload.single('file'), UserController.applyJob);
router.put('/update-profile', verifyToken, UserController.updateProfile);
router.post('/delete-profile', verifyToken, UserController.deleteProfile);
router.put('/update-user', verifyToken, UserController.updateUser);

module.exports = router;