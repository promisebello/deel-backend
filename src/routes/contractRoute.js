const express = require('express');

const router = express.Router();

const { getContracts, getContract } = require('../controllers/contractController');
const { getProfile } = require('../middleware/getProfile');

router.route('/').get(getProfile, getContracts);
router.route('/:id').get(getProfile, getContract);

module.exports = router;
