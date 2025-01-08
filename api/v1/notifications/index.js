const express = require("express");
const router = express.Router();
const { ROLE } = require("#enum/Role.js");
const { requireRoles, requireAuth } = require("#middlewares/JWT.js");

// Routes
module.exports = router;
