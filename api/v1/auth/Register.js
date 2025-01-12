const { log } = require("#common/Logger.js");
const User = require("#models/User.js");
const { getHash, generateSalt } = require("#common/Hasher.js");
const { createToken } = require("#common/JWT.js");
const { filteredUser, generateIdentifier } = require("#models/utils/UserUtils.js");
const { isEmail, isAlphaNumeric } = require("#common/Validator.js");
const { sendMail } = require("#common/Mailer.js");
const { ROLE } = require("#enum/Role.js");
const { getComplexity } = require("#common/Password.js");
const ENV = require("#enum/Env.js");
const { TagNotGeneratedError } = require("#enum/Error.js");
const { CUSTOM_HTTP_STATUS } = require("#enum/HttpStatus.js");

const register = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).send();
    }

    if (!isEmail(email) || !isAlphaNumeric(password)) {
      return res.status(400).send();
    }

    const user = await User.findOne({ "auth.email": email });
    if (user) {
      return res.status(CUSTOM_HTTP_STATUS.AUTH_INFO_TAKEN.code).json({ message: CUSTOM_HTTP_STATUS.AUTH_INFO_TAKEN.message });
    }

    const complexity = getComplexity(password);
    if (complexity < 3) {
      return res.status(400).json({ message: "Password is too weak" });
    }

    const salt = await generateSalt();
    const hash = await getHash(password, salt);

    let finalUsername = null;
    try {
      finalUsername = await generateIdentifier(email);
    } catch (err) {
      if (err === TagNotGeneratedError) {
        return res.status(CUSTOM_HTTP_STATUS.AUTH_INFO_TAKEN).json({ message: CUSTOM_HTTP_STATUS.AUTH_INFO_TAKEN.message });
      }
    }

    const newUser = new User({
      identifier: {
        username: finalUsername.username,
        tag: finalUsername.tag,
      },
      auth: {
        email,
        hash,
        salt,
      },
    });
    await newUser.save();

    const filtered = filteredUser(newUser);
    const token = createToken(newUser._id, ENV.jwt.expiresIn);
    const refreshToken = createToken(newUser._id, ENV.jwt.refreshExpiresIn);
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
