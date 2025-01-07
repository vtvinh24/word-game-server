const { getIo } = require("../../common/Io");
const { log } = require("../../common/Logger");
const { HTTP_STATUS } = require("../../enum/HttpStatus");
const Notification = require("../../models/Notification");

const updateNotification = async (req, res) => {
  try {
    const { notificationId } = req.params;
    const { userId, message, status } = req.body;

    const notification = await Notification.findById(notificationId);
    if (!notification) {
      return res.status(HTTP_STATUS.NOT_FOUND.code).json({
        message: `${HTTP_STATUS.NOT_FOUND.status}: notification`,
      });
    }

    if (userId) notification.userId = userId;
    if (message) notification.message = message;
    if (status && (status === "SENT" || status === "SEEN")) {
      notification.status = status;
    }

    await notification.save();
    getIo().emit("notification-updated", notificationId);
    return res.status(HTTP_STATUS.OK.code).json({
      message: HTTP_STATUS.OK.status,
      data: notification,
    });
  } catch (err) {
    log(err, "ERROR", "routes PATCH /notifications/:notificationId");
    return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR.code).json({
      message: HTTP_STATUS.INTERNAL_SERVER_ERROR.status,
    });
  }
};

module.exports = {
  updateNotification,
};
