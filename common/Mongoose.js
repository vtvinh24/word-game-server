const mongoose = require("mongoose");
const { log } = require("./Logger");

const runningMode = process.env.RUNNING_MODE || "standalone";
const dbHost = runningMode === "docker" ? "db" : (process.env.DB_HOST || "localhost");
const dbPort = process.env.DB_PORT || 27017;
const dbName = process.env.DB_DATABASE || "wordle";
const dbUser = process.env.DB_USER || "root";
const dbPassword = process.env.DB_PASSWORD || "password";
const retryDelay = process.env.DB_RETRY_DELAY || 5000;
const retryCount = process.env.DB_RETRY_COUNT || 5;

const connectString = `mongodb://${dbUser}:${encodeURIComponent(dbPassword)}@${dbHost}:${dbPort}/${dbName}?authSource=admin`;

class Database {
  constructor() {
    this.retryCount = retryCount;
    this.retryDelay = retryDelay;
    this.connectString = connectString;
    this.connect();
  }

  static getInstance() {
    if (!Database.instance) {
      Database.instance = new Database();
    }

    return Database.instance;
  }

  connect(type = "Mongoose") {
    mongoose.set("debug", (collectionName, methodName, ...methodArgs) => {
      const message = `${collectionName}.${methodName}(${methodArgs.map((arg) => JSON.stringify(arg)).join(", ")})`;
      log(message, "DEBUG", "Mongoose");
    });

    this.connectWithRetry(type);
  }

  connectWithRetry(type) {
    mongoose
      .connect(this.connectString)
      .then(() => log(`Connected to ${type} successfully`, "INFO", type))
      .catch((err) => {
        log(err.message, "ERROR", type);
        if (this.retryCount > 0) {
          log(`Retrying to connect in ${this.retryDelay / 1000} seconds...`, "INFO", type);
          setTimeout(() => this.connectWithRetry(type, --this.retryCount), this.retryDelay);
        } else {
          log("Failed to connect to the database after multiple attempts", "ERROR", type);
        }
      });
  }
}

const Mongoose = Database.getInstance();
log("Mongoose initialized", "INFO", "Mongoose");

module.exports = Mongoose;