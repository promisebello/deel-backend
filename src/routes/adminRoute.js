const express = require('express');
const { getBestProfession, getBestClients } = require('../controllers/adminController');

const router = express.Router();

router.route('/best-profession').get(getBestProfession);
router.route('/best-clients').get(getBestClients);
module.exports = router;
