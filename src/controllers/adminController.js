const asyncWrapper = require('../middleware/async-wrapper');
const { getTheBestProfession, getTheBestClients } = require('../services/adminService');

exports.getBestProfession = asyncWrapper(async (req, res) => {
  const { start, end } = req.query;
  const profession = await getTheBestProfession(start, end);

  res.json(profession);
});
exports.getBestClients = asyncWrapper(async (req, res) => {
  const { start, end } = req.query;
  const clients = await getTheBestClients(start, end);

  res.json(clients);
});
