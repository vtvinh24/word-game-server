const OTP_SECRET_ERROR = "Missing or invalid OTP secret";
const OtpSecretError = new Error(OTP_SECRET_ERROR);

module.exports = {
  OtpSecretError,
  OTP_SECRET_ERROR,
};
