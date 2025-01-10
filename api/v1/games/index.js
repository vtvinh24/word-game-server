const express = require("express");
const router = express.Router();
const { ROLE } = require("#enum/Role.js");
const { requireRoles, requireAuth } = require("#middlewares/JWT.js");
const { getGames, getGame } = require("./GetGames");

// Routes
// list
router.get("/", getGames);
// state/watch/reconnect
router.get("/:id", getGame);
// start
// guess
// end

module.exports = router;
