const { notFoundHandler, errorHandler } = require("../middlewares/ErrorHandler");
module.exports = function applyRoutes(app) {
  // app.use("/", require("./root"));
  app.use("/auth", require("./auth"));
  app.use("/media", require("./media"));
  app.use("/notifications", require("./notifications"));
  app.use("/users", require("./users"));
  app.use("/test", require("./test"));

  app.use(notFoundHandler);
  app.use(errorHandler);
};
