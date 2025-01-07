const express = require("express");
const router = express.Router();
const { requireRoles, requireAuth } = require("../../middlewares/JWT");
const { upload } = require("../../common/Multer");
const { ROLE } = require("../../enum/Role");

// Routes
const { getMedia, getSingleMedia } = require("./GetMedia");
router.get("/", requireRoles([ ROLE.ADMIN ]), getMedia);
router.get("/:id", requireAuth, getSingleMedia);

const { createMedia } = require("./CreateMedia");
router.post("/", requireRoles([ROLE.ADMIN]), upload.single("file"), createMedia);

const { updateMedia } = require("./UpdateMedia");
router.patch("/:id", requireAuth, upload.single("file"), updateMedia);

const { deleteMedia } = require("./DeleteMedia");
router.delete("/:id", requireAuth, deleteMedia);

const { replaceMedia } = require("./ReplaceMedia");
router.put("/:id", requireAuth, upload.single("file"), replaceMedia);

module.exports = router;
