const express = require("express");
const { HTTP_STATUS } = require("../../enum/HttpStatus");
const router = express.Router();

const testRoute = async (req, res) => {
  return res.status(HTTP_STATUS.OK.code).json({ message: "Test route" });
};

module.exports = router;
