const Room = require("#models/Room.js");

const getRooms = async (req, res) => {
  try {
    const rooms = await Room.find();
    res.json(rooms);
  } catch (e) {
    res.status(500).send();
  }
};

const getRoom = async (req, res) => {
  const { id } = req.params;
  try {
    const room = await Room.findById(id);
    if (!room) {
      return res.status(404).send();
    }
    res.json(room);
  } catch (e) {
    res.status(500).send();
  }
};

module.exports = { getRooms, getRoom };
