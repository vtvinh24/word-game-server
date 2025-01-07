const { log } = require("../../common/Logger");
const Notification = require("../../models/Notification");
const { HTTP_STATUS } = require("../../enum/HttpStatus");
const { getIo } = require("../../common/Io");

const createNotification = async (req, res) => {
  try {
    const { userId, message } = req.body;

    if (!userId || !message) {
      return res.status(HTTP_STATUS.BAD_REQUEST.code).json({
        message: `${HTTP_STATUS.BAD_REQUEST.status}: userId, message`,
      });
    }

    const notification = new Notification({
      userId: userId,
      message: message,
    });

    await notification.save();
    getIo().emit("notification-created", notification._id);
    return res.status(HTTP_STATUS.CREATED.code).json({
      message: HTTP_STATUS.CREATED.status,
      data: notification,
    });
  } catch (err) {
    log(err, "ERROR", "routes POST /notifications");
    return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR.code).json({
      message: HTTP_STATUS.INTERNAL_SERVER_ERROR.status,
    });
  }
};

module.exports = { createNotification };
