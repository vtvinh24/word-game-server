const { log } = require("#common/Logger.js");
const Room = require("#models/Room.js");

const createRoom = async (req, res) => {
  try {
    const { multiplayer, chatEnabled, p2pEnabled, maxGuesses, maxGameTime, maxGuessTime, gameMode } = req.body;
    const room = new Room({
      settings: {
        multiplayer,
        chatEnabled,
        p2pEnabled,
        maxGuesses,
        maxGameTime,
        maxGuessTime,
        gameMode,
      },
    });
    room.ownerId = req.userId;
    await room.save();
    res.status(201).json(room);
  } catch (e) {
    log(e, "ERROR", "POST /api/v1/rooms");
    res.status(500).send();
  }
};

module.exports = { createRoom };
