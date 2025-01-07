const { log } = require("../../common/Logger");
const { HTTP_STATUS } = require("../../enum/HttpStatus");
const Notification = require("../../models/Notification");

const getNotification = async (req, res) => {
  try {
    const { userId } = req;
    const { notificationId, status } = req.query;
    if (notificationId) {
      const notification = await Notification.findById(notificationId);
      if (!notification) {
        return res.status(HTTP_STATUS.NOT_FOUND.code).json({ message: `${HTTP_STATUS.NOT_FOUND.status}: notification` });
      }
      notification.status = "SEEN";
      await notification.save();
      return res.status(HTTP_STATUS.OK.code).json({ message: HTTP_STATUS.OK.status, data: notification });
    } else {
      const notifications = await Notification.find({ userId });
      if (status) {
        if (status !== "SENT" && status !== "SEEN") {
          return res.status(HTTP_STATUS.BAD_REQUEST.code).json({ message: `${HTTP_STATUS.BAD_REQUEST.status}: status` });
        }
        const filteredNotifications = notifications.filter((notification) => notification.status === status);
        return res.status(HTTP_STATUS.OK.code).json({ data: filteredNotifications });
      }
      return res.status(HTTP_STATUS.OK.code).json({ message: HTTP_STATUS.OK.status, data: notifications });
    }
  } catch (err) {
    log(err, "ERROR", "routes GET /notifications");
    return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR.code).json({ message: HTTP_STATUS.INTERNAL_SERVER_ERROR.status });
  }
};

module.exports = { getNotification };
