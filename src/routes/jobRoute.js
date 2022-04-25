const express = require('express');

const router = express.Router();

const { getProfile } = require('../middleware/getProfile');
const { getUnpaidJobs } = require('../controllers/jobController');
const { payForJob } = require('../controllers/jobController');

router.route('/unpaid').get(getProfile, getUnpaidJobs);
router.route('/:job_id/pay').post(getProfile, payForJob);
module.exports = router;
