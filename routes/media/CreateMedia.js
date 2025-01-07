const Media = require("../../models/Media");
const { saveFile } = require("../../common/File");
const { upload } = require("../../common/Multer");
const { log } = require("../../common/Logger");
const { HTTP_STATUS } = require("../../enum/HttpStatus");
const { ROLE } = require("../../enum/Role");
const { getIo } = require("../../common/Io");

/**
 * This route is meant to be used by admin.
 *
 * For doctors to upload results or prescriptions, they should use the POST appointments/:id/
 */
const createMedia = async (req, res) => {
  try {
    const { name, description, tags, isPublic, url } = req.body;
    const { userId } = req;

    let media;
    if (!url) {
      const file = req.file;
      if (!file) {
        return res.status(HTTP_STATUS.BAD_REQUEST.code).json({ message: `${HTTP_STATUS.BAD_REQUEST.status}: file` });
      }
      media = new Media({
        name: name || file.originalname,
        path: file.path,
        isUrl: false,
        description,
        mimeType: file.mimetype,
        size: file.size,
        owner: userId,
        tags: tags ? tags.split(",") : [],
        isPublic: isPublic === "true",
      });

      await media.save();
    } else {
      // 501: Not Implemented
      return res.status(HTTP_STATUS.NOT_IMPLEMENTED.code).json({ message: `${HTTP_STATUS.NOT_IMPLEMENTED.status}: url` });
    }
    getIo().emit("media-created", media._id);
    return res.status(HTTP_STATUS.CREATED.code).json({ message: HTTP_STATUS.CREATED.status, data: media });
  } catch (err) {
    log(err, "ERROR", "routes POST /media");
    return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR.code).json({ message: HTTP_STATUS.INTERNAL_SERVER_ERROR.status });
  }
};

module.exports = { createMedia };
