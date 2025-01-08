const Media = require("#models/Media.js");
const { log } = require("#common/Logger.js");
const { isMongoId } = require("#common/Validator.js");

const validateQueryParams = (query) => {
  const { id, name, fileType, mimeType, owner, tags, isPublic, sortBy } = query;

  if (id && !isMongoId(id)) {
    return "id";
  }
  if (name && typeof name !== "string") {
    return "name";
  }
  if (fileType && typeof fileType !== "string") {
    return "fileType";
  }
  if (mimeType && typeof mimeType !== "string") {
    return "mimeType";
  }
  if (owner && !isMongoId(owner)) {
    return "owner";
  }
  if (tags && typeof tags !== "string") {
    return "tags";
  }
  if (isPublic !== undefined && isPublic !== "true" && isPublic !== "false") {
    return "isPublic";
  }
  if (sortBy) {
    const [field, direction] = sortBy.split(":");
    if (!field || (direction !== "asc" && direction !== "desc")) {
      return "sortBy";
    }
  }

  return null;
};

const buildQuery = (query) => {
  const { id, name, fileType, mimeType, owner, tags, isPublic } = query;
  const queryObj = {};

  if (id) queryObj._id = id;
  if (name) queryObj.name = new RegExp(name, "i");
  if (fileType) queryObj.fileType = fileType;
  if (mimeType) queryObj.mimeType = mimeType;
  if (owner) queryObj.owner = owner;
  if (tags) queryObj.tags = { $in: tags.split(",") };
  if (isPublic !== undefined) queryObj.isPublic = isPublic === "true";

  return queryObj;
};

const buildSortOptions = (sortBy) => {
  const sortOptions = {};
  if (sortBy) {
    const [field, direction] = sortBy.split(":");
    sortOptions[field] = direction === "desc" ? -1 : 1;
  }
  return sortOptions;
};

const getMedia = async (req, res) => {
  try {
    const validationError = validateQueryParams(req.query);
    if (validationError) {
      return res.status(400).send();
    }

    const query = buildQuery(req.query);
    const sortOptions = buildSortOptions(req.query.sortBy);

    const mediaItems = await Media.find(query).sort(sortOptions);

    if (mediaItems.length === 0) {
      return res.status(404).send();
    }

    return res.status(200).json(mediaItems);
  } catch (err) {
    log(err, "ERROR", "routes GET /media");
    return res.status(500).send();
  }
};

const getSingleMedia = async (req, res) => {
  try {
    const { id } = req.params;
    if (!id || !isMongoId(id)) {
      return res.status(400).send();
    }

    const mediaItem = await Media.findById(id);
    if (!mediaItem) {
      return res.status(404).send();
    }

    const path = mediaItem.path;
    try {
      return res.download(path, mediaItem.name, (err) => {
        if (err) {
          log(err, "ERROR", "routes GET /media/:id");
          return res.status(500).send();
        }
      });
    } catch (err) {
      log(err, "ERROR", "routes GET /media/:id");
      return res.status(404).send();
    }
  } catch (err) {
    log(err, "ERROR", "routes GET /media/:id");
    return res.status(500).send();
  }
};

module.exports = { getMedia, getSingleMedia };
