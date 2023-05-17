const express = require('express');

const router = express.Router();

const CompanyController = require('../controllers/Company.Controller');
const verifyToken = require('../middleware/AuthMiddleware');

router.get('/get-all', CompanyController.getAllCompany);
router.get('/profile', verifyToken, CompanyController.getCompanyProfile);
router.get('/jobs/:limit?', verifyToken, CompanyController.getJobs);
router.get('/applicants/:jobId?', verifyToken, CompanyController.getApplicants);
router.post('/create-job', verifyToken, CompanyController.createJob);
router.put('/update-job', verifyToken, CompanyController.updateJob);
router.put('/approve-job', verifyToken, CompanyController.approveJob);
router.get('/notification', verifyToken, CompanyController.getNotification);

module.exports = router;