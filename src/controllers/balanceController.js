const asyncWrapper = require('../middleware/async-wrapper');
const deposit = require('../services/balanceService');

exports.deposit = asyncWrapper(async (req, res) => {
  const { userId } = req.params;
  const { amount } = req.body;
  const profile = await deposit(amount, userId);
  res.json(profile);
});
