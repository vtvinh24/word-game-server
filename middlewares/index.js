const cors = require("cors");
const compression = require("compression");
const express = require("express");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");
const cookieParser = require("cookie-parser");
const { log } = require("#common/Logger.js");
const { JwtMiddleware } = require("./JWT");
const initializeCronJobs = require("#services/Cron.js");
const isDev = process.env.NODE_ENV === "development";

module.exports = function applyMiddlewares(app) {
  if (isDev) {
    const interceptor = require("./Interceptor");
    app.use(interceptor);
  }
  app.use(cors({ origin: process.env.CORS_ORIGIN, credentials: true }));
  log(`CORS Origin: ${process.env.CORS_ORIGIN}`, "INFO", "CORS");
  app.use(
    rateLimit({
      windowMs: process.env.RATE_LIMITER_WINDOW_MS || 60000,
      max: process.env.RATE_LIMITER_MAX || 10000,
    })
  );
  app.use(compression());
  app.use(
    helmet.contentSecurityPolicy({
      directives: {
        "script-src": ["'self'", "code.jquery.com", "cdn.jsdelivr.net"],
      },
    })
  );
  app.use(cookieParser());
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
  app.use(JwtMiddleware);
  initializeCronJobs();
};
