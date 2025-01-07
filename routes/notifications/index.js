const express = require("express");
const router = express.Router();
// Routes
const { getNotification } = require("./GetNotification");
const { createNotification } = require("./CreateNotification");
const { updateNotification } = require("./UpdateNotification");
const { deleteNotification } = require("./DeleteNotification");
const { ROLE } = require("../../enum/Role");
const { requireRoles, requireAuth } = require("../../middlewares/JWT");

router.get("/", requireAuth, getNotification);
router.post("/",  createNotification);
router.patch("/:notificationId", requireAuth, updateNotification);
router.delete("/:notificationId", requireRoles([ROLE.ADMIN]), deleteNotification);

module.exports = router;
