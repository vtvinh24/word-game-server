const { getIo } = require("../../common/Io");
const { log } = require("../../common/Logger");
const { HTTP_STATUS } = require("../../enum/HttpStatus");
const Notification = require("../../models/Notification");
const deleteNotification = async (req, res) => {
  try {
    const { role } = req;

    const { notificationId } = req.params;

    if (!notificationId) {
      return res.status(HTTP_STATUS.BAD_REQUEST.code).json({ message: `${HTTP_STATUS.BAD_REQUEST.status}: notificationId` });
    }

    const notification = await Notification.findById(notificationId);
    if (!notification) {
      return res.status(HTTP_STATUS.NOT_FOUND.code).json({ message: `${HTTP_STATUS.NOT_FOUND.status}: notification` });
    }

    await Notification.findByIdAndDelete(notificationId);
    getIo().emit("notification-deleted", notificationId);
    return res.status(HTTP_STATUS.OK.code).json({ message: HTTP_STATUS.OK.status });
  } catch (err) {
    log(err, "ERROR", "routes DELETE /notifications");
    return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR.code).json({ message: HTTP_STATUS.INTERNAL_SERVER_ERROR.status });
  }
};

module.exports = { deleteNotification };
