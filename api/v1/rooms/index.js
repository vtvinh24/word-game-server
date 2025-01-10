const { requireAuth } = require("#middlewares/JWT.js");
const express = require("express");
const router = express.Router();

const { createRoom } = require("./CreateRoom");
// router.post("/", requireAuth, createRoom);
router.post("/", createRoom);

const { getRooms, getRoom } = require("./GetRoom");
router.get("/", requireAuth, getRooms);
router.get("/:id", requireAuth, getRoom);

module.exports = router;
