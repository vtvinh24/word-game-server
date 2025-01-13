const express = require("express");
const router = express.Router();
const { ROLE } = require("#enum/Role.js");
const { requireRoles, requireAuth } = require("#middlewares/JWT.js");

// Routes
const { getUser } = require("./GetUser");
router.get("/", requireAuth, getUser);

const { createUser } = require("./CreateUser");
router.post("/", requireRoles([ROLE.ADMIN]), createUser);

const { deleteUser } = require("./DeleteUser");
router.delete("/:userId", requireRoles([ROLE.ADMIN]), deleteUser);

const { updateUser } = require("./UpdateUser");
router.patch("/:userId", requireAuth, updateUser);

module.exports = router;