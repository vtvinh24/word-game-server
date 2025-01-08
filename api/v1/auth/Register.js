const { log } = require("#common/Logger.js");
const User = require("#models/User.js");
const { getHash, generateSalt } = require("#common/Hasher.js");
const { createToken } = require("#common/JWT.js");
const { filteredUser, generateUsername } = require("#models/utils/UserUtils.js");
const { isPhone, isEmail, isAlphaNumeric } = require("#common/Validator.js");
const { CUSTOM_STATUS } = require("#enum/HttpStatus.js");
const { sendVerificationSms, sendMail } = require("#common/Mailer.js");
const { ROLE } = require("#enum/Role.js");
const { getIo } = require("#common/Io.js");
const { getComplexity } = require("#common/Password.js");

const validateRequestBody = (body) => {
  if (!body || Object.keys(body).length === 0) {
    return { code: 400, status: `body` };
  }
  const { username, email, phone, password } = body;
  if (!username && !email && !phone) {
    return { code: 400, status: `username, email, phone` };
  }
  if (!password) {
    return { code: 400, status: `password` };
  }
  if (!isAlphaNumeric(username)) {
    return { code: 400, status: `username` };
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
      return { code: 400, status: `email` };
    }
    const user = await User.findOne({ email });
    if (user) {
      return { code: CUSTOM_STATUS.AUTH_INFO_TAKEN.code, status: `${CUSTOM_STATUS.AUTH_INFO_TAKEN.status}: email` };
    }
  }
  if (phone) {
    if (!isPhone(phone)) {
      return { code: 400, status: `phone` };
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
      return res.status(validationError.code).send();
    }

    const { username, email, phone, password } = req.body;
    const existingUserError = await checkExistingUser(username, email, phone);
    if (existingUserError) {
      return res.status(existingUserError.code).send();
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
      await sendMail(email, "wordle Account Creation", require("config/EmailTemplates/AccountCreated"));
    }

    const filtered = filteredUser(newUser);
    const token = createToken(newUser._id, process.env.JWT_EXPIRES_IN);
    const refreshToken = createToken(newUser._id, process.env.JWT_REFRESH_EXPIRES_IN);
    newUser.lastLogin = new Date();
    await newUser.save();
    return res.status(201).json({
      token,
      refreshToken,
      user: filtered,
    });
  } catch (err) {
    log(err, "ERROR", "routes POST /auth/register");
    return res.status(500).send();
  }
};

module.exports = { register };
