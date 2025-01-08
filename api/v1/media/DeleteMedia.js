const Media = require("#models/Media.js");
const { deleteFile } = require("#common/File.js");
const { ROLE } = require("#enum/Role.js");
const { isMongoId } = require("#common/Validator.js");

const deleteMedia = async (req, res) => {
  try {
    const { userId, role } = req;

    const { id } = req.params;
    if (!isMongoId(id)) {
      return res.status(400).send();
    }

    if (role !== ROLE.ADMIN) {
      const media = await Media.findById(id);
      if (!media) {
        return res.status(404).send();
      }
      if (media.owner.toString() !== userId) {
        return res.status(403).send();
      }
    }

    const media = await Media.findById(id);

    if (!media) {
      return res.status(404).send();
    }

    if (!media.isUrl) {
      await deleteFile(media.path);
    }

    await Media.findByIdAndDelete(id);
    return res.status(200).send();
  } catch (err) {
    log(err, "ERROR", "routes DELETE /media/:id");
    return res.status(500).send();
  }
};

module.exports = { deleteMedia };
