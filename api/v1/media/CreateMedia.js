const Media = require("#models/Media.js");
const { log } = require("#common/Logger.js");
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
        return res.status(400).send();
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
      return res.status(501).send();
    }
    return res.status(201).json(media);
  } catch (err) {
    log(err, "ERROR", "routes POST /media");
    return res.status(500).send();
  }
};

module.exports = { createMedia };
