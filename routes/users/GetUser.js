const { HTTP_STATUS } = require("../../enum/HttpStatus");
const User = require("../../models/User");
const { isEmail, isPhone, isDate, isCountry, isRole, isMongoId, isAlphaNumeric, isIdType, isSpecificCitizenId, isUserStatus } = require("../../common/Validator");
const { getCountryCode } = require("../../common/StringUtils");
const { log } = require("../../common/Logger");
const { filteredUser } = require("../../models/utils/UserUtils");

const validateAndSetFilter = (filter, field, value, validator, res) => {
  if (validator(value)) {
    filter[field] = value;
  } else {
    res.status(HTTP_STATUS.BAD_REQUEST.code).json({ message: `${HTTP_STATUS.BAD_REQUEST.status}: ${field}` });
    return false;
  }
  return true;
};

const getUser = async (req, res) => {
  try {
    const { userId, username, email, phone, role, firstName, lastName, dob, address, country, idType, citizenId, status, page = 1, limit = 10, fullName } = req.query;

    const { userId: currentUserId } = req;

    let filter = {};

    if (req.role !== "ADMIN") {
      const user = await User.findById(currentUserId);
      const filtered = filteredUser(user);
      if (!user) {
        return res.status(HTTP_STATUS.NOT_FOUND.code).json({ message: `${HTTP_STATUS.NOT_FOUND.status}: user` });
      }
      return res.status(HTTP_STATUS.OK.code).json({ message: HTTP_STATUS.OK.status, data: filtered });
    }

    if (userId) {
      if (!isMongoId(userId)) {
        return res.status(HTTP_STATUS.BAD_REQUEST.code).json({ message: `${HTTP_STATUS.BAD_REQUEST.status}: userId` });
      }
      const user = await User.findById(userId);
      if (!user) {
        return res.status(HTTP_STATUS.NOT_FOUND.code).json({ message: `${HTTP_STATUS.NOT_FOUND.status}: user` });
      }
      return res.status(HTTP_STATUS.OK.code).json({ message: HTTP_STATUS.OK.status, data: filteredUser(user) });
    }

    if (role && !validateAndSetFilter(filter, "role", decodeURIComponent(role), isRole, res)) return;
    if (dob && !validateAndSetFilter(filter, "dob", decodeURIComponent(dob), isDate, res)) return;
    if (idType && !validateAndSetFilter(filter, "idType", decodeURIComponent(idType), isIdType, res)) return;
    if (status && !validateAndSetFilter(filter, "status", decodeURIComponent(status), isUserStatus, res)) return;

    if (firstName) filter.firstName = { $regex: new RegExp(decodeURIComponent(firstName), "i") };
    if (lastName) filter.lastName = { $regex: new RegExp(decodeURIComponent(lastName), "i") };
    if (fullName) filter.fullName = { $regex: new RegExp(decodeURIComponent(fullName), "i") };
    if (address) filter.address = { $regex: new RegExp(decodeURIComponent(address), "i") };
    if (email) filter.email = { $regex: new RegExp(decodeURIComponent(email), "i") };
    if (phone) {
      const decodedPhone = decodeURIComponent(phone);
      const escapedPhone = decodedPhone.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"); 
      filter.phone = { $regex: new RegExp(escapedPhone, "i") };
    }
    if (username) filter.username = { $regex: new RegExp(decodeURIComponent(username), "i") };
    if (country) filter.country = { $regex: new RegExp(decodeURIComponent(country), "i") };
    if (citizenId) filter.citizenId = { $regex: new RegExp(decodeURIComponent(citizenId), "i") };

    const users = await User.paginate(filter, parseInt(page), parseInt(limit), [], "-auth");
    return res.status(HTTP_STATUS.OK.code).json({
      message: HTTP_STATUS.OK.status,
      data: users.results,
      pagination: {
        total: users.total,
        pages: users.totalPages,
        page: users.page,
        limit: users.limit,
      },
    });
  } catch (err) {
    log(err, "ERROR", "routes GET /users");
    return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR.code).json({ message: HTTP_STATUS.INTERNAL_SERVER_ERROR.status });
  }
};

module.exports = { getUser };
