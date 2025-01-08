const ENV = Object.freeze({
  cors: {
    origin: process.env.CORS_ORIGIN || "http://localhost:3000",
  },
  port: process.env.PORT || 8000,
  dir: {
    logs: process.env.DIR_LOGS || "logs",
    media: process.env.DIR_MEDIA || "media",
  },
  db: {
    host: process.env.DB_HOST || "localhost",
    port: process.env.DB_PORT || 27017,
    user: process.env.DB_USER || "root",
    password: process.env.DB_PASSWORD || "password",
    database: process.env.DB_DATABASE || "wordle",
  },
  logger: {
    level: process.env.LOGGER_LEVEL || "DEBUG",
  },
  rateLimiter: {
    windowMs: process.env.RATE_LIMITER_WINDOW_MS || 60000,
    max: process.env.RATE_LIMITER_MAX || 10000,
  },
  jwt: {
    secret: process.env.JWT_SECRET || "secret",
    expiresIn: process.env.JWT_EXPIRES_IN || "1h",
    issuer: process.env.JWT_ISSUER || "wordle",
    refreshExpiresIn: process.env.JWT_REFRESH_EXPIRES_IN || "1d",
  },
  otp: {
    length: process.env.OTP_LENGTH || 6,
    expiresIn: process.env.OTP_EXPIRES_IN || 300,
  },
  totp: {
    secret: process.env.TOTP_SECRET || "totpSecret",
  },
  // no default for mailer and smtp
  mailer: {
    fromEmail: process.env.MAILER_FROM_EMAIL,
    fromName: process.env.MAILER_FROM_NAME,
    replyTo: process.env.MAILER_REPLY_TO,
  },
  smtp: {
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT,
    secure: process.env.SMTP_SECURE,
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

module.exports = ENV;
