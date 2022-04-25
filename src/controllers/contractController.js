const asyncWrapper = require('../middleware/async-wrapper');
const { getContracts, getContractById } = require('../services/contractService');

exports.getContracts = asyncWrapper(async (req, res) => {
  const profileId = req.profile.id;
  const contracts = await getContracts(profileId);

  res.json(contracts);
});

exports.getContract = asyncWrapper(async (req, res) => {
  const { id } = req.params;
  const profileId = req.profile.id;
  const contract = await getContractById(id, profileId);

  if (!contract) { return res.status(404).end(); }

  res.json(contract);
});
