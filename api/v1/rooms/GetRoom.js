const { log } = require("#common/Logger.js");
const Room = require("#models/Room.js");

const getRooms = async (req, res) => {
  try {
    const rooms = await Room.find({ "settings.isPublic": true });
    res.json(rooms);
  } catch (e) {
    log(e, "ERROR", "GET /api/v1/rooms");
    res.status(500).send();
  }
};

const getRoom = async (req, res) => {
  const { code } = req.params;
  try {
    const room = await Room.findOne({ code });
    if (!room) {
      return res.status(404).send();
    }
    res.json(room);
  } catch (e) {
    log(e, "ERROR", "GET /api/v1/rooms/:id");
    res.status(500).send();
  }
};

module.exports = { getRooms, getRoom };
