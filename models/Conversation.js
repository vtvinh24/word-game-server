const mongoose = require("mongoose");
const baseSchema = require("./Base");

const conversationSchema = new mongoose.Schema({
  sender: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  receiver: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: false,
  },
  roomId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Room",
    required: false,
  },
  messages: [
    {
      content: {
        type: String,
        required: false,
      },
      timestamp: {
        type: Date,
        default: Date.now,
        required: true,
      },
      read: {
        type: Boolean,
        required: true,
        default: false,
      },
      mediaId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Media",
        required: false,
      },
    },
  ],
});

conversationSchema.add(baseSchema);

const Conversation = mongoose.model("Conversation", conversationSchema);
module.exports = Conversation;
