const { log } = require("#common/Logger.js");
const User = require("#models/User.js");
const { getHash } = require("#common/Hasher.js");
const { createToken } = require("#common/JWT.js");
const { isEmail, isPhone } = require("#common/Validator.js");
const { CUSTOM_STATUS } = require("#enum/HttpStatus.js");
const { verifyTOTP } = require("#common/OTPAuth.js");
const { USER_STATUS } = require("#enum/Fields.js");

const login = async (req, res) => {
  try {
    const { username, email, password, code } = req.body;

    if (!username && !email) {
      return res.status(400).send();
    }

    if (!password) {
      return res.status(CUSTOM_STATUS.AUTH_CREDENTIALS_INVALID.code).json({ message: CUSTOM_STATUS.AUTH_CREDENTIALS_INVALID.status });
    }

    let user;
    if (username) {
      user = await User.findOne({ username });
    } else if (email) {
      if (!isEmail(email)) {
        return res.status(CUSTOM_STATUS.AUTH_CREDENTIALS_INVALID.code).json({ message: CUSTOM_STATUS.AUTH_CREDENTIALS_INVALID.status });
      }
      user = await User.findOne({ email });
    } else if (phone) {
      if (!isPhone(phone)) {
        return res.status(CUSTOM_STATUS.AUTH_CREDENTIALS_INVALID.code).json({ message: CUSTOM_STATUS.AUTH_CREDENTIALS_INVALID.status });
      }
      user = await User.findOne({ phone });
    }

    if (!user) {
      return res.status(CUSTOM_STATUS.AUTH_CREDENTIALS_INVALID.code).json({ message: CUSTOM_STATUS.AUTH_CREDENTIALS_INVALID.status });
    }

    if (user.status === USER_STATUS[3]) {
      return res.status(CUSTOM_STATUS.AUTH_ACCOUNT_LOCKED.code).json({ message: CUSTOM_STATUS.AUTH_ACCOUNT_LOCKED.status });
    }

    const hash = await getHash(password, user.auth.salt);
    if (hash !== user.auth.hash) {
      return res.status(CUSTOM_STATUS.AUTH_CREDENTIALS_INVALID.code).json({ message: CUSTOM_STATUS.AUTH_CREDENTIALS_INVALID.status });
    }

    if (user.auth.enable2FA) {
      if (!code) {
        return res.status(CUSTOM_STATUS.AUTH_REQUIRE_2FA.code).json({ message: CUSTOM_STATUS.AUTH_REQUIRE_2FA.status });
      }
      const valid = await verifyTOTP(user, code);
      if (!valid) {
        return res.status(CUSTOM_STATUS.AUTH_2FA_INVALID.code).json({ message: CUSTOM_STATUS.AUTH_2FA_INVALID.status });
      }
    }

    const token = createToken(user._id, process.env.JWT_EXPIRES_IN);
    const refreshToken = createToken(user._id, process.env.JWT_REFRESH_EXPIRES_IN);
    user.lastLogin = new Date();
    await user.save();

    return res.status(200).json({
      token,
      refreshToken,
    });
  } catch (err) {
    log(err, "ERROR", "routes POST /auth/login");
    return res.status(500).send();
  }
};

module.exports = {
  login,
};
