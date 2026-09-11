const jwt = require('jsonwebtoken');

/**
 * Generate JWT token
 * @param {string} userId
 * @param {string} role
 * @returns {string} token
 */
const generateToken = (userId, role) => {
  const secret = process.env.JWT_SECRET || 'pratibha_setu_fallback_secret_key_2026';
  const expiresIn = process.env.JWT_EXPIRES_IN || '7d';

  return jwt.sign({ id: userId, role }, secret, {
    expiresIn,
  });
};

/**
 * Set HTTP-only auth cookie on response
 * @param {object} res - Express response object
 * @param {string} token
 */
const setTokenCookie = (res, token) => {
  const isProduction = process.env.NODE_ENV === 'production';
  const cookieOptions = {
    httpOnly: true,
    secure: isProduction,
    sameSite: isProduction ? 'strict' : 'lax',
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
  };

  res.cookie('token', token, cookieOptions);
};

module.exports = {
  generateToken,
  setTokenCookie,
};
