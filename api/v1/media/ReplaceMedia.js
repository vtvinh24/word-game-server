/**
 * This route is to replace the media file itself, not just the metadata.
 */
const replaceMedia = async (req, res) => {
  return res.status(501).send();
};

module.exports = { replaceMedia };
