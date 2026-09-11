/**
 * Centralized error handler middleware
 * Maps Mongoose ValidationError, CastError, MongoDB duplicate key code 11000, and standard errors
 */
const errorHandler = (err, req, res, next) => {
  let statusCode = res.statusCode !== 200 ? res.statusCode : 500;
  let message = err.message || 'Internal Server Error';
  let errors = null;

  console.error(`[Error] ${req.method} ${req.originalUrl}:`, err);

  // 1. Mongoose Bad ObjectId (CastError)
  if (err.name === 'CastError') {
    statusCode = 400;
    message = `Invalid resource identifier format for '${err.path}': ${err.value}`;
  }

  // 2. MongoDB Duplicate Key Error (Code 11000)
  if (err.code === 11000) {
    statusCode = 409; // Conflict
    const field = Object.keys(err.keyValue || {})[0] || 'field';
    const value = err.keyValue ? err.keyValue[field] : '';
    
    // Check if it's the compound application index
    if (err.keyPattern && err.keyPattern.opportunityId && err.keyPattern.studentId) {
      message = 'You have already submitted an application for this opportunity.';
    } else {
      message = `Duplicate value '${value}' entered for ${field}. Please use another value.`;
    }
  }

  // 3. Mongoose Schema ValidationError
  if (err.name === 'ValidationError') {
    statusCode = 400;
    message = 'Validation failed on input data.';
    errors = Object.values(err.errors).map((val) => ({
      field: val.path,
      message: val.message,
    }));
  }

  // 4. Multer errors
  if (err.name === 'MulterError') {
    statusCode = 400;
    if (err.code === 'LIMIT_FILE_SIZE') {
      message = 'File size limit exceeded. Maximum allowed size is 5MB.';
    } else {
      message = `File upload error: ${err.message}`;
    }
  }

  // 5. JWT errors
  if (err.name === 'JsonWebTokenError') {
    statusCode = 401;
    message = 'Invalid authentication token.';
  }

  res.status(statusCode).json({
    success: false,
    message,
    ...(errors && { errors }),
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
  });
};

module.exports = errorHandler;
