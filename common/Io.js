const { Server } = require("socket.io");
const { log } = require("#common/Logger.js");
const { SOCKET_INITIALIZED } = require("#enum/Message.js");
const { SOCKET_NOT_INITIALIZED, userNotFoundError, socketAuthError } = require("#enum/Error.js");
const User = require("#models/User.js");
const { verifyToken } = require("./JWT");
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
  log(SOCKET_INITIALIZED, "INFO", "Socket");

  io.use(async (socket, next) => {
    try {
      const token = socket.handshake.auth.token;
      const decoded = verifyToken(token);
      const user = await User.findById(decoded.payload);
      if (!user) {
        return next(userNotFoundError);
      } else {
        socket.userId = user._id;
        return next();
      }
    } catch (error) {
      log(error.message, "ERROR", "Socket");
      return next(socketAuthError);
    }
  });

  io.on("connection", (socket) => {
    const userId = socket.userId;
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
    log(SOCKET_NOT_INITIALIZED, "ERROR", "Socket");
  }
}

/**
 * Emit an event to a specific user
 * @param {string} userId - User._id
 * @param {string} event - The event name
 * @param {object} data - The data to send
 * @example
 * // client
 * const socket = io(SERVER_URL, {
 *   query: {
 *     userId
 *   }
 * });
 */
// Note: To add userId to the socket connection, you can use the query parameter in the connection URL.
function emitToUser(userId, event, data) {
  if (io) {
    const socketId = users.get(userId);
    if (socketId) {
      io.to(socketId).emit(event, data);
    } else {
      log(`User with ID ${userId} not connected`, "ERROR", "Socket");
    }
  } else {
    log(SOCKET_NOT_INITIALIZED, "ERROR", "Socket");
  }
}

module.exports = { init, emit, emitToUser };
