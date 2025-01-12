const Room = require("#models/Room.js");

const JoinRoom = async (req, res) => {
    const { roomId } = req.body;
    const { user } = req;
    const room = await Room.findById(roomId);
    if (!room) {
        return res.status(404).json({ message: "Room not found" });
    }
    if (room.users.includes(user._id)) {
        return res.status(400).json({ message: "User already in room" });
    }
    await room.save();