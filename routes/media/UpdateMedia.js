const { getIo } = require("../../common/Io");
const { ROLE } = require("../../enum/Role");
const Media = require("../../models/Media");

/**
 * This route is to update media metadata, not to replace the media file itself.
 */
const updateMedia = async (req, res) => {
  try {
    const { role } = req;

    const { id } = req.params;
    if (!id || !/^[0-9a-fA-F]{24}$/.test(id)) {
      return res.status(HTTP_STATUS.BAD_REQUEST.code).json({
        message: `${HTTP_STATUS.BAD_REQUEST.status}: id`,
      });
    }

    const media = await Media.findById(id);
    if (!media) {
      return res.status(HTTP_STATUS.NOT_FOUND.code).json({
        message: `${HTTP_STATUS.NOT_FOUND.status}: media`,
      });
    }

    if (userId !== media.owner && role !== ROLE.ADMIN) {
      return res.status(HTTP_STATUS.FORBIDDEN.code).json({
        message: `${HTTP_STATUS.FORBIDDEN.status}: owner`,
      });
    }

    const updateData = req.body;
    Object.keys(updateData).forEach((key) => {
      media[key] = updateData[key];
    });
    await media.save();
    getIo().emit("media-updated", id);
    return res.status(HTTP_STATUS.OK.code).json({
      message: HTTP_STATUS.OK.status,
      data: media,
    });
  } catch (err) {
    log(err, "ERROR", "routes PATCH /media/:id");
    return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR.code).json({
      message: HTTP_STATUS.INTERNAL_SERVER_ERROR.status,
    });
  }
};

module.exports = { updateMedia };
