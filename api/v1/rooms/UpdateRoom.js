const { log } = require("#common/Logger.js");
const Room = require("#models/Room");
const { isNumeric, isGameMode } = require("#common/Validator.js");

const updateRoom = async (req, res) => {
  try {
    const { id } = req.params;
    if (!id) {
      return res.status(400).send();
    }
    const room = await Room.findById(id);
    if (!room) {
      return res.status(404).send();
    }
    const { multiplayer, chatEnabled, p2pEnabled, maxGuesses, maxGameTime, maxGuessTime, gameMode } = req.body;

    if (
      typeof multiplayer !== "boolean" ||
      typeof chatEnabled !== "boolean" ||
      typeof p2pEnabled !== "boolean" ||
      !isNumeric(maxGuesses) ||
      !isNumeric(maxGameTime) ||
      !isNumeric(maxGuessTime) ||
      !isGameMode(gameMode)
    ) {
      return res.status(400).send();
    }

    room.settings.multiplayer = multiplayer;
    room.settings.chatEnabled = chatEnabled;
    room.settings.p2pEnabled = p2pEnabled;
    room.settings.maxGuesses = maxGuesses;
    room.settings.maxGameTime = maxGameTime;
    room.settings.maxGuessTime = maxGuessTime;
    room.settings.gameMode = gameMode;
    await room.save();
    res.json(room);
  } catch (e) {
    log(e, "ERROR", `UPDATE /api/v1/rooms/${req.params.id}`);
    res.status(500).send();
  }
};

module.exports = { updateRoom };
