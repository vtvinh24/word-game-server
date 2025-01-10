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
    required: true,
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

// player join function
roomSchema.methods.join = function (playerId) {
  this.players.push(playerId);
};

// player leave function
roomSchema.methods.leave = function (playerId) {
  this.players = this.players.filter((id) => id.toString() !== playerId.toString());
};

// close room function
roomSchema.methods.close = function () {
  this.status = "closed";
  this.players = [];
};

const Room = mongoose.model("Room", roomSchema);
module.exports = Room;
