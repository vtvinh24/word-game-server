const { getIo } = require("../../common/Io");
const { log } = require("../../common/Logger");
const { getCountryCode, getE164Phone } = require("../../common/StringUtils");
const {
  isPhone,
  isCountry,
  isCountryCode,
  isEmail,
  isSpecificCitizenId,
  isRole,
  isDate,
  isCitizenId,
  isUrl,
  isBase64,
} = require("../../common/Validator");
const { CITIZEN_ID_TYPE } = require("../../enum/Fields");
const { HTTP_STATUS, CUSTOM_STATUS } = require("../../enum/HttpStatus");
const { ROLE } = require("../../enum/Role");
const User = require("../../models/User");
const { filteredUser } = require("../../models/utils/UserUtils");

const updateUser = async (req, res) => {
  try {
    // If the user is not an admin, params will be ignored
    const { userId } = req.params;
    const { role: uRole, userId: uid } = req;

    let user;
    if (uRole === ROLE.ADMIN) {
      user = await User.findById(userId);
    } else {
      user = await User.findById(uid);
    }

    if (!user) {
      return res
        .status(HTTP_STATUS.NOT_FOUND.code)
        .json({ message: HTTP_STATUS.NOT_FOUND.status });
    }

    const {
      firstName,
      lastName,
      phone,
      email,
      dob,
      citizenId,
      avatar,
      address,
      country,
      idType,
      status,
      visibility,
      role,
    } = req.body;

    user.firstName = firstName || user.firstName;
    user.lastName = lastName || user.lastName;

    let countryCode;
    if (country) {
      if (isCountry(country)) {
        countryCode = getCountryCode(country);
      } else if (isCountryCode(country)) {
        countryCode = country;
      } else {
        return res
          .status(HTTP_STATUS.BAD_REQUEST.code)
          .json({ message: `${HTTP_STATUS.BAD_REQUEST.status}: country` });
      }
    }

    if (countryCode && !countryCode !== user.country) {
      user.country = countryCode;
    }

    if (phone && !phone !== user.phone) {
      if (isPhone(phone)) {
        let validPhone = phone;
        if (!phone.startsWith("+")) {
          log(
            `Phone number ${phone} of ${countryCode} does not start with +, attempting to convert to E.164 format`,
            "WARN",
            "routes PATCH /users/:userId"
          );
          validPhone = getE164Phone(phone, countryCode);
        }
        user.phone = validPhone;
      } else {
        return res
          .status(HTTP_STATUS.BAD_REQUEST.code)
          .json({ message: `${HTTP_STATUS.BAD_REQUEST.status}: phone` });
      }
    }

    if (email && email !== user.email) {
      if (isEmail(email)) {
        user.email = email;
      } else {
        return res
          .status(HTTP_STATUS.BAD_REQUEST.code)
          .json({ message: `${HTTP_STATUS.BAD_REQUEST.status}: email` });
      }
    }

    if (dob && dob !== user.dob) {
      if (isDate(dob)) {
        user.dob = dob;
      } else {
        return res
          .status(HTTP_STATUS.BAD_REQUEST.code)
          .json({ message: `${HTTP_STATUS.BAD_REQUEST.status}: dob` });
      }
    }

    if (country && idType && citizenId && citizenId !== user.citizenId) {
      if (isSpecificCitizenId(citizenId, countryCode, idType)) {
        user.citizenId = citizenId;
        user.idType = idType;
      } else {
        return res
          .status(CUSTOM_STATUS.CITIZEN_ID_INVALID.code)
          .json({ message: CUSTOM_STATUS.CITIZEN_ID_INVALID.status });
      }
    } else if (citizenId && citizenId !== user.citizenId) {
      if (isCitizenId(citizenId)) {
        user.idType = CITIZEN_ID_TYPE[0];
        user.citizenId = citizenId;
      } else {
        return res
          .status(CUSTOM_STATUS.CITIZEN_ID_INVALID.code)
          .json({ message: CUSTOM_STATUS.CITIZEN_ID_INVALID.status });
      }
    }

    if (avatar) {
      if (isUrl(avatar)) {
        user.avatar = avatar;
      } else if (isBase64(avatar)) {
        user.avatar = avatar;
      } else {
        return res
          .status(HTTP_STATUS.BAD_REQUEST.code)
          .json({ message: `${HTTP_STATUS.BAD_REQUEST.status}: avatar` });
      }
    }

    user.address = address || user.address;

    if (status) {
      if (uRole === ROLE.ADMIN) {
        user.status = status;
      } else {
        return res
          .status(HTTP_STATUS.FORBIDDEN.code)
          .json({ message: HTTP_STATUS.FORBIDDEN.status });
      }
    }

    if (visibility) {
      user.visibility = !!visibility;
    }
    console.log("role", role);
    if (role) {
      if (uRole === ROLE.ADMIN) {
        if (isRole(role)) {
          user.role = role;
        } else {
          return res
            .status(HTTP_STATUS.BAD_REQUEST.code)
            .json({ message: `${HTTP_STATUS.BAD_REQUEST.status}: role` });
        }
      }
      // else {
      //   return res
      //     .status(HTTP_STATUS.FORBIDDEN.code)
      //     .json({ message: HTTP_STATUS.FORBIDDEN.status });
      // }
    }

    await user.save();
    getIo().emit("user-updated", user._id);
    return res.status(HTTP_STATUS.OK.code).json({
      message: HTTP_STATUS.OK.status,
      //data: filteredUser(user),
      data: user,
    });
  } catch (err) {
    log(err, "ERROR", "routes PATCH /users/:userId");
    return res
      .status(HTTP_STATUS.INTERNAL_SERVER_ERROR.code)
      .json({ message: HTTP_STATUS.INTERNAL_SERVER_ERROR.status });
  }
};

module.exports = { updateUser };
