const { log } = require("#common/Logger.js");
const Conversation = require("#models/Conversation.js");
const Room = require("#models/Room.js");

const getRoomMessages = async (req, res) => {
  try {
    const { roomId } = req.params;
    const room = await Room.findById(roomId);
    if (!room) {
      return res.status(404).send();
    }
    const messages = await Conversation.find({ roomId });
    res.json(messages);
  } catch (e) {
    log(e, "ERROR", "GET /api/v1/rooms/:id/messages");
    res.status(500).send();
  }
};

const createRoomMessage = async (req, res) => {
  try {
    const { roomId, content } = req.body;
    const userId = req.userId;
    const room = await Room.findById(roomId);
    if (!room) {
      return res.status(404).send();
    }
    let conversation = await Conversation.find({ roomId, sender: userId });
    if (!conversation) {
      conversation = new Conversation({ roomId, sender: userId });
    }

    const timestamp = Date.now();

    conversation.messages.push({ content, timestamp });
    await conversation.save();
    res.status(201).json({
      conversationId: conversation._id,
      timestamp,
      content,
    });
  } catch (e) {
    log(e, "ERROR", "POST /api/v1/rooms/:id/messages");
    res.status(500).send();
  }
};

module.exports = { getRoomMessages, createRoomMessage };
