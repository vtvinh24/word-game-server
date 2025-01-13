const { log } = require("#common/Logger.js");
const User = require("#models/User.js");
const { getHash } = require("#common/Hasher.js");
const { createToken } = require("#common/JWT.js");
const { isEmail } = require("#common/Validator.js");
const { CUSTOM_HTTP_STATUS } = require("#enum/HttpStatus.js");
const { verifyTOTP } = require("#common/OTPAuth.js");
const { USER_STATUS } = require("#enum/Fields.js");
const ENV = require("#enum/Env.js");

const login = async (req, res) => {
  try {
    const { username, email, password, code } = req.body;

    if (!username && !email) {
      return res.status(CUSTOM_HTTP_STATUS.AUTH_CREDENTIALS_INVALID.code).json({ message: CUSTOM_HTTP_STATUS.AUTH_CREDENTIALS_INVALID.message });
    }

    if (!password) {
      return res.status(CUSTOM_HTTP_STATUS.AUTH_CREDENTIALS_INVALID.code).json({ message: CUSTOM_HTTP_STATUS.AUTH_CREDENTIALS_INVALID.message });
    }

    let user;
    if (username) {
      user = await User.findOne({ "identifier.username": username });
    } else if (email) {
      if (!isEmail(email)) {
        return res.status(CUSTOM_HTTP_STATUS.AUTH_CREDENTIALS_INVALID.code).json({ message: CUSTOM_HTTP_STATUS.AUTH_CREDENTIALS_INVALID.message });
      }
      user = await User.findOne({ "auth.email": email });
    }

    if (!user) {
      return res.status(CUSTOM_HTTP_STATUS.AUTH_CREDENTIALS_INVALID.code).json({ message: CUSTOM_HTTP_STATUS.AUTH_CREDENTIALS_INVALID.message });
    }

    if (user.auth.banned) {
      return res.status(CUSTOM_HTTP_STATUS.AUTH_ACCOUNT_LOCKED.code).json({ message: CUSTOM_HTTP_STATUS.AUTH_ACCOUNT_LOCKED.message });
    }

    const hash = await getHash(password, user.auth.salt);
    if (hash !== user.auth.hash) {
      return res.status(CUSTOM_HTTP_STATUS.AUTH_CREDENTIALS_INVALID.code).json({ message: CUSTOM_HTTP_STATUS.AUTH_CREDENTIALS_INVALID.message });
    }

    if (user.auth.twoFactor.enabled) {
      if (!code) {
        return res.status(CUSTOM_HTTP_STATUS.AUTH_REQUIRE_2FA.code).json({ message: CUSTOM_HTTP_STATUS.AUTH_REQUIRE_2FA.message });
      }
      const valid = await verifyTOTP(user, code);
      if (!valid) {
        return res.status(CUSTOM_HTTP_STATUS.AUTH_2FA_INVALID.code).json({ message: CUSTOM_HTTP_STATUS.AUTH_2FA_INVALID.message });
      }
    }

    const token = createToken(user._id, ENV.jwt.expiresIn);
    const refreshToken = createToken(user._id, ENV.jwt.refreshExpiresIn);
    user.auth.lastLogin = new Date();
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
