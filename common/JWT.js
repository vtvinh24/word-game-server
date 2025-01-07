const jwt = require("jsonwebtoken");

/**
 * This function creates a JWT token
 * @param {object} payload The object to be stored in the token, usually the user (or user ID) object
 * @param {number} expiresIn The expiry time in seconds
 * @returns {string} The JWT token
 */
const createToken = (payload, expiresIn) => {
  return jwt.sign({ payload }, process.env.JWT_SECRET, {
    expiresIn,
    issuer: process.env.JWT_ISSUER,
  });
};

/**
 * This function verifies a JWT token
 * @param {string} token The token to verify
 * @returns {object} The decoded token
 */
const verifyToken = (token) => {
  return jwt.verify(token, process.env.JWT_SECRET, { issuer: process.env.JWT_ISSUER });
};

module.exports = { createToken, verifyToken };
