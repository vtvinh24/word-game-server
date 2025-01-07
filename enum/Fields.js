// Some of the fields are defined in another file
const { ROLE: ROLES } = require("./Role");

// Generic

// User
const ROLE = [ROLES.PLAYER, ROLES.SUPPORT, ROLES.MANAGER, ROLES.ADMIN];
const USER_STATUS = ["REGISTERED", "ACTIVE", "INACTIVE"];

// Notification
const NOTIFICATION_STATUS = ["SENT", "SEEN"];

module.exports = {
  ROLE,
  USER_STATUS,
  NOTIFICATION_STATUS,
};
