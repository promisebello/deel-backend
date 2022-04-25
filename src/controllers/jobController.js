const asyncWrapper = require('../middleware/async-wrapper');
const { getUnpaidJobs, makePayment } = require('../services/jobService');

exports.getUnpaidJobs = asyncWrapper(async (req, res) => {
  const profileId = req.profile.id;
  const jobs = await getUnpaidJobs(profileId);

  res.json(jobs);
});
exports.payForJob = asyncWrapper(async (req, res) => {
  const jobId = req.params.job_id;
  const profileId = req.profile.id;

  const modified = await makePayment(profileId, jobId);

  res.json(modified);
});
