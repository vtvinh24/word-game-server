const Media = require("../../models/Media");
const { log } = require("../../common/Logger");
const { HTTP_STATUS } = require("../../enum/HttpStatus");
const { isMongoId, isAlphaNumeric } = require("../../common/Validator");
const { readFile } = require("../../common/File");
const { ROLE } = require("../../enum/Role");

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
      return res.status(HTTP_STATUS.BAD_REQUEST.code).json({
        message: `
        ${HTTP_STATUS.BAD_REQUEST.status}: ${validationError}
        `,
      });
    }

    const query = buildQuery(req.query);
    const sortOptions = buildSortOptions(req.query.sortBy);

    const mediaItems = await Media.find(query).sort(sortOptions);

    if (mediaItems.length === 0) {
      return res.status(HTTP_STATUS.NOT_FOUND.code).json({ message: HTTP_STATUS.NOT_FOUND.status });
    }

    return res.status(HTTP_STATUS.OK.code).json({
      message: `Found ${mediaItems.length} matching media`,
      data: mediaItems,
    });
  } catch (err) {
    log(err, "ERROR", "routes GET /media");
    return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR.code).json({ message: HTTP_STATUS.INTERNAL_SERVER_ERROR.status });
  }
};

const getSingleMedia = async (req, res) => {
  try {
    const { authenticated, userId, role } = req;
    if (!authenticated) {
      return res.status(HTTP_STATUS.UNAUTHORIZED.code).json({ message: HTTP_STATUS.UNAUTHORIZED.status });
    }

    const { id } = req.params;
    if (!id || !isMongoId(id)) {
      return res.status(HTTP_STATUS.BAD_REQUEST.code).json({ message: `${HTTP_STATUS.BAD_REQUEST.status}: id` });
    }

    const { service, appointmentId } = req.query;
    if (service && !["checkup", "prescription", "report"].includes(service)) {
      return res.status(HTTP_STATUS.BAD_REQUEST.code).json({ message: `${HTTP_STATUS.BAD_REQUEST.status}: service` });
    }

    if (role !== ROLE.ADMIN) {
      if (!appointmentId || !isMongoId(appointmentId)) {
        return res.status(HTTP_STATUS.BAD_REQUEST.code).json({ message: `${HTTP_STATUS.BAD_REQUEST.status}: appointmentId` });
      }

      const appointment = await Appointment.findById(appointmentId);
      if (!appointment) {
        return res.status(HTTP_STATUS.NOT_FOUND.code).json({ message: `${HTTP_STATUS.NOT_FOUND.status}: appointment` });
      }

      const { doctorId, patientId } = appointment;
      if ((role === ROLE.DOCTOR && userId !== doctorId) || (role === ROLE.PATIENT && userId !== patientId)) {
        return res.status(HTTP_STATUS.FORBIDDEN.code).json({ message: HTTP_STATUS.FORBIDDEN.status });
      }
    }

    const mediaItem = await Media.findById(id);
    if (!mediaItem) {
      return res.status(HTTP_STATUS.NOT_FOUND.code).json({ message: `${HTTP_STATUS.NOT_FOUND.status}: media` });
    }

    const path = mediaItem.path;
    try {
      const file = await readFile(path);
      return res.download(path, mediaItem.name, (err) => {
        if (err) {
          log(err, "ERROR", "routes GET /media/:id");
          return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR.code).json({
            message: HTTP_STATUS.INTERNAL_SERVER_ERROR.status,
          });
        }
      });
    } catch (err) {
      log(err, "ERROR", "routes GET /media/:id");
      return res.status(HTTP_STATUS.NOT_FOUND.code).json({ message: `${HTTP_STATUS.NOT_FOUND.status}: file` });
    }
  } catch (err) {
    log(err, "ERROR", "routes GET /media/:id");
    return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR.code).json({ message: HTTP_STATUS.INTERNAL_SERVER_ERROR.status });
  }
};

module.exports = { getMedia, getSingleMedia };
