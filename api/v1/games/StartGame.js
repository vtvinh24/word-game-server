const Room = require("#models/Room.js");

const startGame = async (req, res) => {
  try {
    const { id } = req.params;
    const room = await Room.findById(id);
    if (!room) {
      return res.status(404).send();
    }

    const game = await 

    // Start game
  } catch (e) {
    return res.status(500).send();
  }
};

module.exports = { startGame };
