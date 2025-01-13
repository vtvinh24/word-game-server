const { log } = require("#common/Logger.js");
const Room = require("#models/Room.js");

const JoinRoom = async (req, res) => {
  try {
    const { roomId } = req.body;
    const userId = req.userId;
    const room = await Room.findById(roomId);
    if (!room) {
      return res.status(404).send();
    }
    if (room.users.includes(userId)) {
      return res.status(400).send();
    }
    room.users.push(userId);
    await room.save();
    res.status(200).send();
  } catch (e) {
    log(e, "ERROR", "GET /api/v1/rooms/:id/join");
    res.status(500).send();
  }
};

module.exports = { JoinRoom };
