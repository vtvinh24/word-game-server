/**
 * This route is to update media metadata, not to replace the media file itself.
 */
const updateMedia = async (req, res) => {
  return res.status(501).send();
};

module.exports = { updateMedia };
