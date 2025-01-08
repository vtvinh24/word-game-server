// Generic errors
const USER_NOT_FOUND = "User not found";
const userNotFoundError = new Error(USER_NOT_FOUND);

// Business errors
const OTP_SECRET_ERROR = "Missing or invalid OTP secret";
const OtpSecretError = new Error(OTP_SECRET_ERROR);

// Socket errors
const SOCKET_NOT_INITIALIZED = "Socket.io server not initialized";
const SOCKET_AUTH_ERROR = "Socket authentication error";
const socketAuthError = new Error(SOCKET_AUTH_ERROR);

module.exports = {
  USER_NOT_FOUND,
  userNotFoundError,
  OtpSecretError,
  OTP_SECRET_ERROR,
  SOCKET_NOT_INITIALIZED,
  SOCKET_AUTH_ERROR,
  socketAuthError,
};
