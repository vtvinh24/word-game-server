const { Server } = require("socket.io");
const { log } = require("../common/Logger");
let io;
const users = new Map();

function getCorsConfig() {
  return {
    cors: {
      origin: process.env.CORS_ORIGIN,
      methods: ["GET", "POST", "PATCH", "DELETE", "PUT"],
    },
  };
}

function init(server) {
  io = new Server(server, getCorsConfig());
  log("Socket.io server initialized", "INFO", "Socket");

  io.on("connection", (socket) => {
    const userId = socket.handshake.query.userId;
    users.set(userId, socket.id);

    socket.on("disconnect", () => {
      users.delete(userId);
    });
  });

  return io;
}

/**
 *
 * @param {string} event
 * @param {object} data
 */
function emit(event, data) {
  if (io) {
    io.emit(event, data);
  } else {
    log("Socket.io server not initialized", "ERROR", "Socket");
  }
}

/**
 * Emit an event to a specific user
 * @param {string} userId - The user ID
 * @param {string} event - The event name
 * @param {object} data - The data to send
 */
function emitToUser(userId, event, data) {
  if (io) {
    const socketId = users.get(userId);
    if (socketId) {
      io.to(socketId).emit(event, data);
    } else {
      log(`User with ID ${userId} not connected`, "ERROR", "Socket");
    }
  } else {
    log("Socket.io server not initialized", "ERROR", "Socket");
  }
}

module.exports = { init, emit, emitToUser };
