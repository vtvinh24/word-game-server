const { requireAuth } = require("#middlewares/JWT.js");
const express = require("express");
const router = express.Router();

const { createRoom } = require("./CreateRoom");
router.post("/", requireAuth, createRoom);

const { getRooms, getRoom } = require("./GetRoom");
router.get("/", requireAuth, getRooms);
router.get("/:id", requireAuth, getRoom);

const { JoinRoom } = require("./JoinRoom");
router.get("/:id/join", requireAuth, JoinRoom);

const { leaveRoom } = require("./LeaveRoom");
router.get("/:id/leave", requireAuth, leaveRoom);

const { updateRoom } = require("./UpdateRoom");
const { deleteRoom } = require("./DeleteRoom");
router.patch("/:id", requireAuth, updateRoom);
router.delete("/:id", requireAuth, deleteRoom);

const { getRoomMessages, createRoomMessage } = require("./RoomMessage");
router.get("/:id/messages", requireAuth, getRoomMessages);
router.post("/:id/messages", requireAuth, createRoomMessage);

module.exports = router;
