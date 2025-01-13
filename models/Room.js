const mongoose = require("mongoose");
const baseSchema = require("./Base");
const { GAME_MODE } = require("#enum/Game.js");

const roomSettingsSchema = new mongoose.Schema({
  multiplayer: { type: Boolean, required: true },
  chatEnabled: { type: Boolean, required: true },
  p2pEnabled: { type: Boolean, required: true },
  maxGuesses: { type: Number, required: true },
  maxGameTime: { type: Number, required: true },
  maxGuessTime: { type: Number, required: true },
  gameMode: {
    type: String,
    enum: GAME_MODE,
    default: GAME_MODE[0],
  },
});

const roomSchema = new mongoose.Schema({
  ownerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: false,
  },

  settings: roomSettingsSchema,
  players: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  ],
});

roomSchema.add(baseSchema);

roomSchema.pre("remove", async function (next) {
  await this.model("Conversation").deleteMany({ roomId: this._id });
  next();
});

const Room = mongoose.model("Room", roomSchema);
module.exports = Room;
