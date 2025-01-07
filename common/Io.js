const { Server } = require("socket.io");
const { log } = require("../common/Logger");
let io;

function getCorsConfig() {
  return {
    cors: {
      origin: process.env.CORS_ORIGIN,
      methods: [ "GET", "POST", "PATCH", "DELETE", "PUT" ],
    },
  };
}

function init(server) {
  io = new Server(server, getCorsConfig());
  log("Socket.io server initialized", "INFO", "Socket");
  return io;
}

module.exports = { init, getIo: () => io };