const express = require('express');


const router = express.Router();
const JobController = require('../controllers/Job.Controller');

router.get('/get-all', JobController.getAllJob);
router.get('/get-recommend-job', JobController.getRecommendJob);
router.get('/get-job-detail/:id', JobController.getJobDetail);
router.get('/search-job', JobController.searchJob);
router.get('/company-job', JobController.getCompanyJob);

module.exports = router;