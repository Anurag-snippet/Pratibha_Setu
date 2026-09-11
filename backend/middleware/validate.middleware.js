const { validationResult } = require('express-validator');

/**
 * Middleware to evaluate express-validator rules and return formatted 400 errors
 */
const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const formattedErrors = errors.array().map((err) => ({
      field: err.path || err.param,
      message: err.msg,
      value: err.value,
    }));

    return res.status(400).json({
      success: false,
      message: 'Validation failed on submitted data',
      errors: formattedErrors,
    });
  }
  next();
};

module.exports = validate;
