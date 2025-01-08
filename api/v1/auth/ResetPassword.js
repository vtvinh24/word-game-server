const { generateSalt, getHash } = require("#common/Hasher.js");
const { log } = require("#common/Logger.js");
const Code = require("#models/Code.js");
const User = require("#models/User.js");
const { sendMail, sendSms } = require("#common/Mailer.js");

const resetPassword = async (req, res) => {
  // scenario: code is generated and sent to email or phone, and this route is called to verify the code and reset the password
  try {
    const { email, phone, code, password } = req.body;
    if (!email && !phone) {
      return res.status(400).send();
    }

    if (!code) {
      return res.status(400).send();
    }

    let user;
    if (email) {
      user = await User.findOne({ email });
    }

    if (phone) {
      user = await User.findOne({ phone });
    }

    if (!user) {
      return res.status(404).send();
    }

    const storedCode = await Code.findOne({ target: email || phone, code });
    if (!storedCode) {
      return res.status(400).send();
    }

    if (!password) {
      return res.status(400).send();
    }

    const salt = await generateSalt();
    const hashedPassword = await getHash(password, salt);
    await User.updateOne({ _id: user._id }, { "auth.hash": hashedPassword, "auth.salt": salt });
    await Code.deleteOne({ _id: storedCode._id });

    const htmlTemplate = require("config/EmailTemplates/PasswordChanged");
    if (email) {
      await sendMail({ email }, "wordle Password Changed", htmlTemplate);
    }

    if (phone) {
      sendSms(phone, "en", `Your password has been reset. If you did not request this, please contact us immediately.`);
    }

    return res.status(200).send();
  } catch (err) {
    log(err, "ERROR", "routes");
    return res.status(500).send();
  }
};

module.exports = {
  resetPassword,
};
