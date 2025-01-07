const { getIo } = require("../../common/Io");
const { log } = require("../../common/Logger");
const { HTTP_STATUS } = require("../../enum/HttpStatus");
const User = require("../../models/User");

const deleteUser = async (req, res) => {
  try {
    const { userId } = req.params;
    const user = await User.findById(userId);
    if (!user) {
      return res.status(HTTP_STATUS.NOT_FOUND.code).json({ message: `${HTTP_STATUS.NOT_FOUND.status}: user` });
    }
    // await user.softDelete();
    // return res.status(HTTP_STATUS.OK.code).json({ message: HTTP_STATUS.OK.status });
    let newStatus;
    if (user.status === "LOCKED") {
      newStatus = "ACTIVE";
    } else {
      newStatus = "LOCKED";
    }

    const updatedUser = await User.findByIdAndUpdate(user._id, { status: newStatus, deletedBy: req.userId }, { new: true }).select("-auth");

    if (!updatedUser) {
      return res.status(HTTP_STATUS.NOT_FOUND.code).json({ message: `${HTTP_STATUS.NOT_FOUND.status}: user` });
    } else {
      getIo().emit("user-deleted", userId);
      return res.status(HTTP_STATUS.OK.code).json({
        message: HTTP_STATUS.OK.status,
        data: updatedUser,
      });
    }
  } catch (err) {
    log(err, "ERROR", "PATCH /users/:userId");
    return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR.code).json({ message: HTTP_STATUS.INTERNAL_SERVER_ERROR.status });
  }
};

module.exports = { deleteUser };
