const express = require("express");
const app = express();

const { log } = require("./common/Logger");

require("./common/Mongoose");

const applyMiddlewares = require("./middlewares");
applyMiddlewares(app);

const applyRoutes = require("./routes");
applyRoutes(app);

let port = process.env.APP_PORT || 8000;
const server = app
  .listen(port, () => {
    log(`Server is running on port ${port}`, "INFO", "Server");
  })
  .on("error", handleServerError);

const { init } = require("./common/Io");
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
