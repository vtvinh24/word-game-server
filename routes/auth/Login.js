const { log } = require("../../common/Logger");
const User = require("../../models/User");
const { getHash } = require("../../common/Hasher");
const { createToken } = require("../../common/JWT");
const { filteredUser } = require("../../models/utils/UserUtils");
const { isEmail, isPhone } = require("../../common/Validator");
const { HTTP_STATUS, CUSTOM_STATUS } = require("../../enum/HttpStatus");
const { verifyTOTP } = require("../../common/OTPAuth");
const { USER_STATUS } = require("../../enum/Fields");

const login = async (req, res) => {
  try {
    const { username, email, phone, password, code } = req.body;

    if (!username && !email && !phone) {
      return res.status(HTTP_STATUS.BAD_REQUEST.code).json({ message: HTTP_STATUS.BAD_REQUEST.status });
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

    if(user.status === USER_STATUS[3]) {
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

    return res.status(HTTP_STATUS.OK.code).json({
      message: HTTP_STATUS.OK.status,
      data: {
        token,
        refreshToken,
      },
    });
  } catch (err) {
    log(err, "ERROR", "routes POST /auth/login");
    return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR.code).json({ message: HTTP_STATUS.INTERNAL_SERVER_ERROR.status });
  }
};

module.exports = {
  login,
};
