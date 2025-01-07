const User = require("../../models/User");
const { log } = require("../../common/Logger");
const { getHash, generateSalt } = require("../../common/Hasher");
const { createToken } = require("../../common/JWT");
const { filteredUser, generateUsername } = require("../../models/utils/UserUtils");
const { isPhone, isEmail, isRole, isDate, isCountry, isIdType, isSpecificCitizenId, isUserStatus } = require("../../common/Validator");
const { HTTP_STATUS } = require("../../enum/HttpStatus");
const { getCountryCode } = require("../../common/StringUtils");
const { getIo } = require("../../common/Io");

const createUser = async (req, res) => {
  try {
    let { username, email, phone, password } = req.body;
    let { role, firstName, lastName, dob, address, country, idType, citizenId, status, visibility } = req.body;

    if (!req.body || Object.keys(req.body).length === 0) {
      return res.status(HTTP_STATUS.BAD_REQUEST.code).json({ message: HTTP_STATUS.BAD_REQUEST.status });
    }

    // Username or email or phone is required
    if (!username && !email && !phone) {
      return res.status(HTTP_STATUS.BAD_REQUEST.code).json({ message: `${HTTP_STATUS.BAD_REQUEST.status}: identifier` });
    }

    // Password is required
    if (!password) {
      return res.status(HTTP_STATUS.BAD_REQUEST.code).json({ message: `${HTTP_STATUS.BAD_REQUEST.status}: password` });
    }

    // Case 1: Username is provided
    if (username) {
      // Check if username is already taken
      const user = await User.findOne({ username });
      if (user) {
        return res.status(HTTP_STATUS.CONFLICT.code).json({ message: `${HTTP_STATUS.CONFLICT.status}: username` });
      }
    }

    // Case 2: Email is provided
    if (email) {
      if (!isEmail(email)) {
        return res.status(HTTP_STATUS.BAD_REQUEST.code).json({ message: `${HTTP_STATUS.BAD_REQUEST.status}: email` });
      }
      // Check if email is already taken
      const user = await User.findOne({ email });
      if (user) {
        return res.status(HTTP_STATUS.CONFLICT.code).json({ message: `${HTTP_STATUS.CONFLICT.status}: email` });
      }
    }

    // Case 3: Phone is provided
    if (phone) {
      if (!isPhone(phone)) {
        return res.status(HTTP_STATUS.BAD_REQUEST.code).json({ message: `${HTTP_STATUS.BAD_REQUEST.status}: phone` });
      }
      // Check if phone is already taken
      const user = await User.findOne({ phone });
      if (user) {
        return res.status(HTTP_STATUS.CONFLICT.code).json({ message: `${HTTP_STATUS.CONFLICT.status}: phone` });
      }
    }

    if (role) {
      if (!isRole(role)) {
        return res.status(HTTP_STATUS.BAD_REQUEST.code).json({ message: `${HTTP_STATUS.BAD_REQUEST.status}: role` });
      }
    }

    if (dob) {
      if (!isDate(dob)) {
        return res.status(HTTP_STATUS.BAD_REQUEST.code).json({ message: `${HTTP_STATUS.BAD_REQUEST.status}: dob` });
      }
    }

    if (country) {
      if (!isCountry(country)) {
        return res.status(HTTP_STATUS.BAD_REQUEST.code).json({ message: `${HTTP_STATUS.BAD_REQUEST.status}: country` });
      }
    }

    if (idType) {
      if (!isIdType(idType)) {
        return res.status(HTTP_STATUS.BAD_REQUEST.code).json({ message: `${HTTP_STATUS.BAD_REQUEST.status}: idType` });
      }
    }

    if (citizenId) {
      if (!isSpecificCitizenId(citizenId, getCountryCode(country), idType)) {
        return res.status(HTTP_STATUS.BAD_REQUEST.code).json({ message: `${HTTP_STATUS.BAD_REQUEST.status}: citizenId` });
      }
    }

    if (status) {
      if (!isUserStatus(status)) {
        return res.status(HTTP_STATUS.BAD_REQUEST.code).json({ message: `${HTTP_STATUS.BAD_REQUEST.status}: status` });
      }
    }

    if (visibility) {
      if (typeof visibility !== "boolean") {
        return res.status(HTTP_STATUS.BAD_REQUEST.code).json({ message: `${HTTP_STATUS.BAD_REQUEST.status}: visibility` });
      }
    }

    const salt = await generateSalt();
    const hash = await getHash(password, salt);
    if (!username) {
      username = await generateUsername(email, phone);
    }

    const newUser = new User({
      username: username,
      auth: {
        hash,
        salt,
      },
      phone,
      email,
      role,
      firstName,
      lastName,
      dob,
      address,
      country,
      idType,
      citizenId,
      status,
      visibility,
    });
    await newUser.save();

    await newPatient.save();
    getIo().emit("user-created", newUser._id);

    const filtered = filteredUser(newUser);
    const token = createToken(filtered, process.env.JWT_EXPIRES_IN);
    const refreshToken = createToken(filtered, process.env.JWT_REFRESH_EXPIRES_IN);

    return res.status(HTTP_STATUS.CREATED.code).json({
      message: HTTP_STATUS.CREATED.status,
      data: {
        token,
        refreshToken,
        user: filtered,
        patientId: newPatient._id,
      },
    });
  } catch (err) {
    log(err, "ERROR", "routes POST /auth/register");
    return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR.code).json({ message: HTTP_STATUS.INTERNAL_SERVER_ERROR.status });
  }
};

module.exports = { createUser };
