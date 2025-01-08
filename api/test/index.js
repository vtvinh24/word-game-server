const { log } = require("#common/Logger.js");
const express = require("express");

const router = express.Router();

const testRoute = async (req, res) => {
  log("Test route hit", "INFO", "routes GET /test");
  return res.status(200).send();
};

router.get("/", testRoute);

module.exports = router;
