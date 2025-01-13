const { log } = require("#common/Logger.js");
const Room = require("#models/Room.js");

const leaveRoom = async (req, res) => {
  try {
    const { roomId } = req.body;
    const userId = req.userId;
    const room = await Room.findById(roomId);
    if (!room) {
      return res.status(404).send();
    }
    if (!room.users.includes(userId)) {
      return res.status(400).send();
    }
    room.users = room.users.filter((user) => user !== userId);
    await room.save();
    res.status(200).send();
  } catch (e) {
    log(e, "ERROR", "GET /api/v1/rooms/:id/leave");
    res.status(500).send();
  }
};

module.exports = { leaveRoom };
