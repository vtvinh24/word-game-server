const { log } = require("../common/Logger");

module.exports.notFoundHandler = (req, res, next) => {
  const url = req.originalUrl;
  const method = req.method;
  log(`Not found`, "DEBUG", `routes ${method} ${url}`);
  res.status(404).json({ message: "route not found" });
};

module.exports.errorHandler = (err, req, res, next) => {
  const method = req.method;
  const url = req.originalUrl;
  log(`${err.message}`, "DEBUG", `routes ${method} ${url}`);
  res.status(err.status || 500).json({ message: "internal server error" });
};
