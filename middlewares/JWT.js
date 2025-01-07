const { verifyToken } = require("../common/JWT");
const User = require("../models/User");
const { HTTP_STATUS, CUSTOM_STATUS } = require("../enum/HttpStatus");

/**
 * This middleware checks if the user has a valid JWT token, then attaches the user ID and role to the request object
 * @returns
 */
const JwtMiddleware = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  const token = authHeader ? authHeader.split(" ")[1] : null;

  req.authenticated = false;

  if (!token) {
    return next();
  }

  try {
    const decoded = verifyToken(token);
    const user = await User.findById(decoded.payload);

    if (!user) {
      return res.status(HTTP_STATUS.UNAUTHORIZED.code).json({ message: `${HTTP_STATUS.UNAUTHORIZED.status}: user` });
    }

    req.userId = user._id;
    req.role = user.role;
    req.authenticated = true;

    if(!req.userId || !req.role) {
      return res.status(HTTP_STATUS.UNAUTHORIZED.code).json({ message: `${HTTP_STATUS.UNAUTHORIZED.status}: invalid token` });
    }

    next();
  } catch (error) {
    if (error.name === "TokenExpiredError") {
      return res.status(CUSTOM_STATUS.AUTH_TOKEN_EXPIRED.code).json({ message: CUSTOM_STATUS.AUTH_TOKEN_EXPIRED.status });
    }
    return res.status(HTTP_STATUS.UNAUTHORIZED.code).json({ message: `${HTTP_STATUS.UNAUTHORIZED.status}: invalid token` });
  }
};

/**
 * This middleware checks if the user is authenticated
 * @returns
 */
const requireAuth = async (req, res, next) => {
  if (!req.authenticated) {
    return res.status(HTTP_STATUS.UNAUTHORIZED.code).json({ message: `${HTTP_STATUS.UNAUTHORIZED.status}: authentication required` });
  }
  next();
};

/**
 * This middleware checks if the user has the required role to access the resource
 * @param {string[]} roles
 * @returns
 */
const requireRoles = (roles) => {
  return async (req, res, next) => {
    if (roles.includes(req.role)) {
      next();
    } else {
      res.status(HTTP_STATUS.FORBIDDEN.code).json({ message: `${HTTP_STATUS.FORBIDDEN.status}: insufficient permissions` });
    }
  };
};

module.exports = { JwtMiddleware, requireAuth, requireRoles };
