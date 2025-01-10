const express = require("express");
const router = express.Router();

router.use("/", require("./_root"));
router.use("/auth", require("./auth"));
router.use("/media", require("./media"));
router.use("/notifications", require("./notifications"));
router.use("/users", require("./users"));
router.use("/rooms", require("./rooms"));
router.use("/games", require("./games"));

module.exports = router;
