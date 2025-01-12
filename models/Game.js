const mongoose = require("mongoose");
const baseSchema = require("./Base");
const LETTER_COLOR = require("#enum/LetterColor.js");

// Score and time calculation/storing can be changed if DB performance is needed
// For now, they are stored as a cache
// Also streak/penalty mechanism can be applied if they are stored this way.
const guessResultSchema = new mongoose.Schema({
  correct: { type: Boolean, required: true },
  time: { type: Number, required: true },
  guessed: [
    {
      letter: { type: String, required: true },
      color: { type: String, enum: LETTER_COLOR, required: true },
    },
  ],
  score: {
    type: Number,
    required: true,
    default: 0,
  },
});

const wordSchema = new mongoose.Schema({
  score: { type: Number, required: true },
  word: { type: String, required: true },
  time: { type: Number, required: true },
  guesses: { type: [guessResultSchema], required: true },
});

const gameSchema = new mongoose.Schema(
  {
    // settings
    playerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    room: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Room",
      required: true,
    },
    time: { type: Number, required: true },
    ended: { type: Boolean, required: true },
    score: { type: Number, required: true },

    words: [wordSchema],
  },
  {
    timestamps: false,
  }
);

gameSchema.add(baseSchema);

const Game = mongoose.model("Game", gameSchema);
module.exports = Game;
