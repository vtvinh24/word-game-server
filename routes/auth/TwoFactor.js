const { log } = require("../../common/Logger");
const { generateTOTP, verifyTOTP } = require("../../common/OTPAuth");
const { OtpSecretError } = require("../../enum/Error");
const { HTTP_STATUS, CUSTOM_STATUS } = require("../../enum/HttpStatus");
const User = require("../../models/User");

const generate2FA = async (req, res) => {
  const { userId } = req;

  try {
    const user = await User.findById(userId);
    if (!user) {
      return res.status(HTTP_STATUS.UNAUTHORIZED.code).json({ message: HTTP_STATUS.UNAUTHORIZED.status });
    }
    const buffer = await generateTOTP(user);

    res.setHeader("Content-Type", "image/png");
    res.status(HTTP_STATUS.OK.code).send(buffer);
  } catch (err) {
    log(err, "ERROR", "routes GET /auth/2fa/generate");
    return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR.code).json({ message: HTTP_STATUS.INTERNAL_SERVER_ERROR.status });
  }
};

const toggle2FA = async (req, res) => {
  const { userId } = req;
  if (!userId) {
    return res.status(HTTP_STATUS.UNAUTHORIZED.code).json({ message: HTTP_STATUS.UNAUTHORIZED.status });
  }
  try {
    const { code } = req.body;
    if (!code) {
      return res.status(HTTP_STATUS.BAD_REQUEST.code).json({ message: HTTP_STATUS.BAD_REQUEST.status });
    }
    const user = await User.findById(userId);
    if (!user) {
      return res.status(HTTP_STATUS.UNAUTHORIZED.code).json({ message: HTTP_STATUS.UNAUTHORIZED.status });
    }
    const valid = await verifyTOTP(user, code);
    if (valid) {
      const current = user.auth.enable2FA;
      const newVal = !current;
      user.auth.enable2FA = newVal;
      await user.save();
      return res.status(HTTP_STATUS.OK.code).json({ message: `Two-factor authentication has been ${newVal ? "enabled" : "disabled"}` });
    }
    return res.status(CUSTOM_STATUS.AUTH_2FA_INVALID.code).json({ message: CUSTOM_STATUS.AUTH_2FA_INVALID.status });
  } catch (err) {
    if (err === OtpSecretError) {
      return res.status(CUSTOM_STATUS.AUTH_2FA_DISABLED.code).json({ message: CUSTOM_STATUS.AUTH_2FA_DISABLED.status });
    }
    log(err, "ERROR", "routes POST /auth/2fa/toggle");
    return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR.code).json({ message: HTTP_STATUS.INTERNAL_SERVER_ERROR.status });
  }
};

const verify2FA = async (req, res) => {
  const { userId } = req;

  try {
    const { code } = req.body;
    if (!code) {
      return res.status(HTTP_STATUS.BAD_REQUEST.code).json({ message: HTTP_STATUS.BAD_REQUEST.status });
    }
    const user = await User.findById(userId);
    if (!user) {
      return res.status(HTTP_STATUS.UNAUTHORIZED.code).json({ message: HTTP_STATUS.UNAUTHORIZED.status });
    }
    const enabled = user.auth.enable2FA;
    if (enabled) {
      const valid = await verifyTOTP(user, code);
      if (valid) return res.status(HTTP_STATUS.OK.code).json({ message: HTTP_STATUS.OK.status });
      else return res.status(CUSTOM_STATUS.AUTH_2FA_INVALID.code).json({ message: CUSTOM_STATUS.AUTH_2FA_INVALID.status });
    } else {
      return res.status(HTTP_STATUS.FORBIDDEN.code).json({ message: HTTP_STATUS.FORBIDDEN.status });
    }
  } catch (err) {
    log(err, "ERROR", "routes POST /auth/2fa/verify");
    return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR.code).json({ message: HTTP_STATUS.INTERNAL_SERVER_ERROR.status });
  }
};

module.exports = {
  toggle2FA,
  verify2FA,
  generate2FA,
};
