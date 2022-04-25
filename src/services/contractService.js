const { Op } = require('sequelize');
const { Contract } = require('../model');

async function getContracts(profileId) {
  return Contract.findAll({
    where: { status: { [Op.ne]: 'terminated' }, [Op.or]: [{ ClientId: profileId }, { ContractorId: profileId }] },
  });
}

async function getContractById(id, profileId) {
  return Contract.findOne({
    where: { id, [Op.or]: [{ ClientId: profileId }, { ContractorId: profileId }] },
  });
}

module.exports = { getContracts, getContractById };
