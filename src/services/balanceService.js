const { StatusCodes } = require('http-status-codes');
const {
  Contract, Job, Profile, sequelize,
} = require('../model');
const { CustomAPIError } = require('../errors/custom-error');
const asyncWrapper = require('../middleware/async-wrapper');

 async function deposit(amountToDeposit, userId) {
  const result = await sequelize.transaction(async (theTransaction) => {
    const theClient = await Profile.findByPk(userId, { transaction: theTransaction });

    if (theClient == null || theClient.type !== 'client') {
      throw new CustomAPIError(StatusCodes.NOT_FOUND, 'User is not a client');
    }

    const totalClientUnpaidJobs = await sumOfJobsUnpaid(userId);
    const limit = totalClientUnpaidJobs * 0.25;
    if (amountToDeposit > limit) { throw new CustomAPIError(StatusCodes.BAD_REQUEST, 'The amount to deposit was greater than the deposit limit'); }
    
    const sum = theClient.balance += amountToDeposit;

    theClient.balance = Math.round((sum + Number.EPSILON) * 100) / 100;

    await theClient.save({ transaction: theTransaction });
    return theClient;
  });

  return result;
}

async function sumOfJobsUnpaid(clientId) {
  return Job.sum('price', {
    where: { paid: false },
    include: [
      {
        where: { status: 'in_progress', ClientId: clientId },
        attributes: [],
        model: Contract,
        required: true,
      },
    ],
  });
}

module.exports = deposit;
