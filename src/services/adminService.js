const { Op } = require('sequelize');
const {
  Contract, Job, Profile, sequelize,
} = require('../model');

async function getTheBestClients(initialDate, finalDate, limit = 2) {
  const bestClients = await Job.findAll({
    attributes: [[sequelize.fn('sum', sequelize.col('price')), 'paid']],
    group: ['Contract.Client.id'],
    limit,
    order: [[sequelize.fn('sum', sequelize.col('price')), 'DESC']],
    where: { paid: true, paymentDate: { [Op.between]: [initialDate, finalDate] } },
    include: [
      {
        attributes: ['id'],
        include: [{
          attributes: ['id', 'firstName', 'lastName'], as: 'Client', model: Profile, where: { type: 'client' },
        }],
        model: Contract,
      },
    ],
  });

  const result = bestClients.map((jobCollection) => ({
    id: jobCollection.Contract.Client.id,
    fullName: `${jobCollection.Contract.Client.firstName} ${jobCollection.Contract.Client.lastName}`,
    paid: jobCollection.paid,
  }));

  return result;
}
async function getTheBestProfession(initialDate, finalDate) {
  const selectedJobs = await Job.findAll({
    attributes: [[sequelize.fn('sum', sequelize.col('price')), 'totalPaid']],
    limit: 1,
    group: ['Contract.Contractor.profession'],
    order: [[sequelize.fn('sum', sequelize.col('price')), 'DESC']],
    include: [
      {
        attributes: ['createdAt'],
        include: [{
          attributes: ['profession'], as: 'Contractor', model: Profile, where: { type: 'contractor' },
        }],
        model: Contract,
      },
    ],
    where: { paid: true, createdAt: { [Op.between]: [initialDate, finalDate] } },
  });

  if (!selectedJobs.length) { return null; }

  const actualJob = selectedJobs.shift().get({ plain: true });

  return { profession: actualJob.Contract.Contractor.profession, totalPaid: actualJob.totalPaid };
}

module.exports = { getTheBestClients, getTheBestProfession };
