const express = require("express");
const router = express.Router();

// Routes
const { getRoot } = require("./Get");
router.get("/", getRoot);

module.exports = router;
