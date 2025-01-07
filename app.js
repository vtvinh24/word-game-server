const express = require("express");
const applyMiddlewares = require("./middlewares");
const applyRoutes = require("./routes");

const { log } = require("./common/Logger");
const { init } = require("./common/Io");
const Mongoose = require("./common/Mongoose");

const app = express();
applyMiddlewares(app);
applyRoutes(app);

let port = process.env.APP_PORT || 8000;
const server = app
  .listen(port, () => {
    log(`Server is running on port ${port}`, "INFO", "Server");
  })
  .on("error", handleServerError);

init(server);

function handleServerError(err) {
  if (err.code === "EADDRINUSE") {
    log(`Port ${port} is already in use`, "ERROR");
    port++;
    server.listen(port);
  } else {
    log(err.message, "ERROR");
  }
}
