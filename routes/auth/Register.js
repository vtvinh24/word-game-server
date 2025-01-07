const { log } = require("../../common/Logger");
const User = require("../../models/User");
const { getHash, generateSalt } = require("../../common/Hasher");
const { createToken } = require("../../common/JWT");
const { filteredUser, generateUsername } = require("../../models/utils/UserUtils");
const { isPhone, isEmail, isAlphaNumeric } = require("../../common/Validator");
const { HTTP_STATUS, CUSTOM_STATUS } = require("../../enum/HttpStatus");
const { sendVerificationSms, sendMail } = require("../../common/Mailer");
const { ROLE } = require("../../enum/Role");
const { getIo } = require("../../common/Io");
const { getComplexity } = require("../../common/Password");

const validateRequestBody = (body) => {
  if (!body || Object.keys(body).length === 0) {
    return { code: HTTP_STATUS.BAD_REQUEST.code, status: `${HTTP_STATUS.BAD_REQUEST.status}: body` };
  }
  const { username, email, phone, password } = body;
  if (!username && !email && !phone) {
    return { code: HTTP_STATUS.BAD_REQUEST.code, status: `${HTTP_STATUS.BAD_REQUEST.status}: username, email, phone` };
  }
  if (!password) {
    return { code: HTTP_STATUS.BAD_REQUEST.code, status: `${HTTP_STATUS.BAD_REQUEST.status}: password` };
  }
  if (!isAlphaNumeric(username)) {
    return { code: HTTP_STATUS.BAD_REQUEST.code, status: `${HTTP_STATUS.BAD_REQUEST.status}: username` };
  }

  const complexity = getComplexity(password);
  if (complexity < 3) {
    return { code: CUSTOM_STATUS.AUTH_PASSWORD_TOO_WEAK.code, status: `${CUSTOM_STATUS.AUTH_PASSWORD_TOO_WEAK.status}: ${complexity}` };
  }

  return null;
};

const checkExistingUser = async (username, email, phone) => {
  if (username) {
    const user = await User.findOne({ username });
    if (user) {
      return { code: CUSTOM_STATUS.AUTH_INFO_TAKEN.code, status: `${CUSTOM_STATUS.AUTH_INFO_TAKEN.status}: username` };
    }
  }
  if (email) {
    if (!isEmail(email)) {
      return { code: HTTP_STATUS.BAD_REQUEST.code, status: `${HTTP_STATUS.BAD_REQUEST.status}: email` };
    }
    const user = await User.findOne({ email });
    if (user) {
      return { code: CUSTOM_STATUS.AUTH_INFO_TAKEN.code, status: `${CUSTOM_STATUS.AUTH_INFO_TAKEN.status}: email` };
    }
  }
  if (phone) {
    if (!isPhone(phone)) {
      return { code: HTTP_STATUS.BAD_REQUEST.code, status: `${HTTP_STATUS.BAD_REQUEST.status}: phone` };
    }
    const user = await User.findOne({ phone });
    if (user) {
      return { code: CUSTOM_STATUS.AUTH_INFO_TAKEN.code, status: `${CUSTOM_STATUS.AUTH_INFO_TAKEN.status}: phone` };
    }
  }
  return null;
};

const register = async (req, res) => {
  try {
    const validationError = validateRequestBody(req.body);
    if (validationError) {
      return res.status(validationError.code).json({ message: validationError.status });
    }

    const { username, email, phone, password } = req.body;
    const existingUserError = await checkExistingUser(username, email, phone);
    if (existingUserError) {
      return res.status(existingUserError.code).json({ message: existingUserError.status });
    }

    const salt = await generateSalt();
    const hash = await getHash(password, salt);
    const finalUsername = username || (await generateUsername(email, phone));

    const newUser = new User({
      username: finalUsername,
      auth: { hash, salt },
      phone,
      email,
      role: ROLE.PATIENT,
    });
    await newUser.save();

    if (phone) {
      await sendVerificationSms(phone, "en");
    }

    if (email) {
      await sendMail(email, "wordle Account Creation", require("../../config/EmailTemplates/AccountCreated"));
    }

    const filtered = filteredUser(newUser);
    const token = createToken(newUser._id, process.env.JWT_EXPIRES_IN);
    const refreshToken = createToken(newUser._id, process.env.JWT_REFRESH_EXPIRES_IN);
    newUser.lastLogin = new Date();
    await newUser.save();

    getIo().emit("user-created", newUser._id);

    return res.status(HTTP_STATUS.CREATED.code).json({
      message: HTTP_STATUS.CREATED.status,
      data: { token, refreshToken, user: filtered },
    });
  } catch (err) {
    log(err, "ERROR", "routes POST /auth/register");
    return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR.code).json({ message: HTTP_STATUS.INTERNAL_SERVER_ERROR.status });
  }
};

module.exports = { register };
