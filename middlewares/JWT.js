const { verifyToken } = require("#common/JWT.js");
const User = require("#models/User.js");
const { CUSTOM_HTTP_STATUS } = require("#enum/HttpStatus.js");
const { createToken } = require("../common/JWT");
const ENV = require("#enum/Env.js");

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
      return res.status(401).json({ message: `Unauthorized: user` });
    }

    req.userId = user._id;
    req.role = user.role;
    req.authenticated = true;

    if(!req.userId || !req.role) {
      return res.status(401).json({ message: `Unauthorized: invalid token` });
    }

    next();
  } catch (error) {
    if (error.name === "TokenExpiredError") {
      return res.status(CUSTOM_HTTP_STATUS.AUTH_TOKEN_EXPIRED.code).json({ message: CUSTOM_HTTP_STATUS.AUTH_TOKEN_EXPIRED.status });
    }
    return res.status(401).json({ message: `Unauthorized: invalid token` });
  }
};

/**
 * This middleware checks if the user is authenticated
 * @returns
 */
const requireAuth = async (req, res, next) => {
  if (!req.authenticated) {
    return res.status(401).json({ message: `Unauthorized: authentication required` });
  }
  next();
};

const refreshToken = async (req, res) => {
  const { refreshToken } = req.body;

  if (!refreshToken) {
    return res.status(400).json({ message: "Refresh token is required" });
  }

  try {
    const decoded = verifyToken(refreshToken);
    const user = await User.findById(decoded.payload);

    if (!user) {
      return res.status(401).json({ message: "Unauthorized: user not found" });
    }

    const newToken = createToken(user._id, ENV.jwt.expiresIn);
    const newRefreshToken = createToken(user._id, ENV.jwt.refreshExpiresIn);

    return res.status(200).json({
      token: newToken,
      refreshToken: newRefreshToken,
    });
  } catch (error) {
    if (error.name === "TokenExpiredError") {
      return res.status(CUSTOM_HTTP_STATUS.AUTH_TOKEN_EXPIRED.code).json({ message: CUSTOM_HTTP_STATUS.AUTH_TOKEN_EXPIRED.message });
    }
    return res.status(401).json({ message: "Unauthorized: invalid refresh token" });
  }
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
      res.status(403).json({ message: `Forbidden: insufficient permissions` });
    }
  };
};

module.exports = { JwtMiddleware, requireAuth, requireRoles, refreshToken };
