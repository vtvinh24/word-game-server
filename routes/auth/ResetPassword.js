const { generateSalt, getHash } = require("../../common/Hasher");
const { log } = require("../../common/Logger");
const Code = require("../../models/Code");
const User = require("../../models/User");
const { generateAlphaNumericCode } = require("../../models/utils/CodeUtils");
const { HTTP_STATUS } = require("../../enum/HttpStatus");
const { sendMail, sendSms } = require("../../common/Mailer");

const resetPassword = async (req, res) => {
  // scenario: code is generated and sent to email or phone, and this route is called to verify the code and reset the password
  try {
    const { email, phone, code, password } = req.body;
    if (!email && !phone) {
      return res.status(HTTP_STATUS.BAD_REQUEST.code).json({ message: `${HTTP_STATUS.BAD_REQUEST.status}: email or phone` });
    }

    if (!code) {
      return res.status(HTTP_STATUS.BAD_REQUEST.code).json({ message: `${HTTP_STATUS.BAD_REQUEST.status}: code` });
    }

    let user;
    if (email) {
      user = await User.findOne({ email });
    }

    if (phone) {
      user = await User.findOne({ phone });
    }

    if (!user) {
      return res.status(HTTP_STATUS.NOT_FOUND.code).json({ message: `${HTTP_STATUS.NOT_FOUND.status}: user` });
    }

    const storedCode = await Code.findOne({ target: email || phone, code });
    log(storedCode, "INFO", "routes");
    if (!storedCode) {
      return res.status(HTTP_STATUS.BAD_REQUEST.code).json({ message: `${HTTP_STATUS.BAD_REQUEST.status}: code` });
    }

    if (!password) {
      return res.status(HTTP_STATUS.BAD_REQUEST.code).json({ message: `${HTTP_STATUS.BAD_REQUEST.status}: password` });
    }

    const salt = await generateSalt();
    const hashedPassword = await getHash(password, salt);
    await User.updateOne({ _id: user._id }, { "auth.hash": hashedPassword, "auth.salt": salt });
    await Code.deleteOne({ _id: storedCode._id });

    const htmlTemplate = require("../../config/EmailTemplates/PasswordChanged");
    if (email) {
      await sendMail({ email }, "wordle Password Changed", htmlTemplate);
    }

    if (phone) {
      sendSms(phone, "en", `Your password has been reset. If you did not request this, please contact us immediately.`);
    }

    return res.status(HTTP_STATUS.OK.code).json({ message: HTTP_STATUS.OK.status });
  } catch (err) {
    log(err, "ERROR", "routes");
    return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR.code).json({ message: HTTP_STATUS.INTERNAL_SERVER_ERROR.status });
  }
};

module.exports = {
  resetPassword,
};
