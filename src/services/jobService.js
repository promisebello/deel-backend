const { Op } = require('sequelize');
const { StatusCodes } = require('http-status-codes');
const {
  Contract, Job, Profile, sequelize,
} = require('../model');
const { createCustomError, CustomAPIError } = require('../errors/custom-error');

async function getUnpaidJobs(clientId) {
  return Job.findAll({
    where: { paid: false },
    include: [
      {
        attributes: [],
        model: Contract,
        required: true,
        where: { status: 'in_progress', [Op.or]: [{ ClientId: clientId }, { ContractorId: clientId }] },
      },
    ],
  });
}

async function makePayment(clientId, jobId) {
  const result = await sequelize.transaction(async (theTransaction) => {
    const theJob = await Job.findOne(
      {
        where: { id: jobId },
        include: [
          {
            attributes: ['ContractorId'],
            model: Contract,
            required: true,
            where: { ClientId: clientId },
          },
        ],
      },
      { transaction: theTransaction },
    );

    if (theJob == null) { throw new CustomAPIError(StatusCodes.NOT_FOUND, 'Job could not be found'); }

    if (theJob.paid) { throw new CustomAPIError(StatusCodes.CONFLICT, 'Job has already been paid'); }

    const [contractor, theClient] = await Promise.all([
      Profile.findByPk(theJob.Contract.ContractorId, {
        transaction: theTransaction,
      }),
      Profile.findByPk(clientId, { transaction: theTransaction }),
    ]);

    if (theClient.balance < theJob.price) {
      throw new CustomAPIError(StatusCodes.BAD_REQUEST, 'Insufficient balance');
    }

    contractor.balance += theJob.price;
    theClient.balance -= theJob.price;
    theJob.paid = true;
    theJob.paymentDate = new Date().toISOString();

    await Promise.all([
      theClient.save({ transaction: theTransaction }),
      contractor.save({ transaction: theTransaction }),
      theJob.save({ transaction: theTransaction }),
    ]);

    return theJob;
  });

  return result;
}

module.exports = { getUnpaidJobs, makePayment };
