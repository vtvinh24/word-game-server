const Media = require("../../models/Media");
const { deleteFile } = require("../../common/File");
const { HTTP_STATUS } = require("../../enum/HttpStatus");
const { ROLE } = require("../../enum/Role");
const { getIo } = require("../../common/Io");

const deleteMedia = async (req, res) => {
  try {
    const { userId, role } = req;

    const { id } = req.params;
    if (!id || !/^[0-9a-fA-F]{24}$/.test(id)) {
      return res.status(HTTP_STATUS.BAD_REQUEST.code).json({ message: `${HTTP_STATUS.BAD_REQUEST.status}: id` });
    }

    if (role !== ROLE.ADMIN) {
      const media = await Media.findById(id);
      if (!media) {
        return res.status(HTTP_STATUS.NOT_FOUND.code).json({ message: `${HTTP_STATUS.NOT_FOUND.status}: media` });
      }
      if (media.owner.toString() !== userId) {
        return res.status(HTTP_STATUS.FORBIDDEN.code).json({ message: `${HTTP_STATUS.FORBIDDEN.status}: owner` });
      }
    }

    const media = await Media.findById(id);

    if (!media) {
      return res.status(HTTP_STATUS.NOT_FOUND.code).json({ message: `${HTTP_STATUS.NOT_FOUND.status}: media` });
    }

    if (!media.isUrl) {
      await deleteFile(media.path);
    }

    await Media.findByIdAndDelete(id);
    getIo().emit("media-deleted", id);
    return res.status(HTTP_STATUS.OK.code).json({ message: HTTP_STATUS.OK.status });
  } catch (err) {
    log(err, "ERROR", "routes DELETE /media/:id");
    return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR.code).json({ message: HTTP_STATUS.INTERNAL_SERVER_ERROR.status });
  }
};

module.exports = { deleteMedia };
