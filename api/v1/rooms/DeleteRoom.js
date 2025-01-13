const { log } = require("#common/Logger.js");
const Room = require("#models/Room.js");

const deleteRoom = async (req, res) => {
  try {
    const { id } = req.params;
    if (!id) {
      return res.status(400).send();
    }
    const room = await Room.findById(id);
    if (!room) {
      return res.status(404).send();
    }
    await room.remove();
    res.status(200).send();
  } catch (e) {
    log(e, "ERROR", `DELETE /api/v1/rooms/${req.params.id}`);
    res.status(500).send();
  }
};

module.exports = { deleteRoom };
