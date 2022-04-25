const { CustomAPIError } = require('../errors/custom-error');

const asyncWrapper = (fn) => async (req, res, next) => {
  try {
    await fn(req, res, next);
  } catch (error) {
    if (error instanceof CustomAPIError) {
      return res.status(error.message).json({
        error: error.status,
      });
    }
    next(error);
  }
};

module.exports = asyncWrapper;
