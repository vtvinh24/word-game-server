const User = require("#models/User.js");
const { log } = require("#common/Logger.js");
const { getHash, generateSalt } = require("#common/Hasher.js");
const { createToken } = require("#common/JWT.js");
const { filteredUser, generateUsername } = require("#models/utils/UserUtils.js");

const createUser = async (req, res) => {
  try {
    // identifier
    const { username, tag } = req.body;
    // auth
    const { password, email, role } = req.body;
    // personal info
    const { firstName, lastName, dob, avatar } = req.body;
    // settings
    const { visibility, language } = req.body;
    // read-only settings
    const { status, subscribed } = req.body;

    const user = new User({
      username: username || generateUsername(email),
      tag,
      password: await getHash(password, await generateSalt()),
      email,
      role,
      firstName,
      lastName,
      dob,
      avatar,
      visibility,
      language,
      status,
      subscribed,
    });

    const filtered = filteredUser(user);
    const token = createToken(filtered, process.env.JWT_EXPIRES_IN);
    const refreshToken = createToken(filtered, process.env.JWT_REFRESH_EXPIRES_IN);

    return res.status(201).json({
      token,
      refreshToken,
    });
  } catch (err) {
    log(err, "ERROR", "routes POST /auth/register");
    return res.status(500).send();
  }
};

module.exports = { createUser };
