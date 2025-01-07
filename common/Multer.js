const multer = require("multer");
const path = require("path");
const { createDirectory } = require("./File");

const storage = multer.diskStorage({
  destination: async (req, file, cb) => {
    const uploadDir = path.join(__dirname, "../", process.env.DIR_MEDIA, new Date().toISOString().split("T")[0]);
    await createDirectory(uploadDir);
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

const upload = multer({ storage });

module.exports = {
  upload,
};
