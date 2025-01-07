const express = require("express");
const router = express.Router();
const { toggle2FA, generate2FA, verify2FA } = require("./TwoFactor");
const { requireAuth } = require("../../middlewares/JWT");

const { login } = require("./Login");
router.post("/login", login);

const { register } = require("./Register");
router.post("/register", register);

const { resetPassword } = require("./ResetPassword");
router.post("/reset", resetPassword);

const { verify, sendCode } = require("./VerifyAccount");
router.post("/verify", requireAuth, verify);
router.post("/send-code", sendCode);

router.get("/2fa", requireAuth, generate2FA)
router.put("/2fa", requireAuth, toggle2FA);

module.exports = router;
