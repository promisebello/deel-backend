const express = require('express');

const router = express.Router();

const { getProfile } = require('../middleware/getProfile');
const { deposit } = require('../controllers/balanceController');

router.route('/deposit/:userId').post(getProfile, deposit);
module.exports = router;
