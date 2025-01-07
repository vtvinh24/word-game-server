const { log } = require("../../common/Logger");
const { sendVerificationSms, sendMail } = require("../../common/Mailer");
const Code = require("../../models/Code");
const User = require("../../models/User");
const { generateNumericCode } = require("../../models/utils/CodeUtils");
const { HTTP_STATUS } = require("../../enum/HttpStatus");
const { getIo } = require("../../common/Io");
const expiresIn = process.env.OTP_EXPIRES_IN || 300;
const length = process.env.OTP_LENGTH || 6;

const verify = async (req, res) => {
  try {
    const { code } = req.body;
    const { userId } = req;
    if (!code) {
      return res.status(HTTP_STATUS.BAD_REQUEST.code).json({ message: `${HTTP_STATUS.BAD_REQUEST.status}: code` });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(HTTP_STATUS.NOT_FOUND.code).json({ message: `${HTTP_STATUS.NOT_FOUND.status}: user` });
    }

    const codeDoc = await Code.findOne({ target: user.email || user.phone });
    if (!codeDoc) {
      return res.status(HTTP_STATUS.NOT_FOUND.code).json({ message: `${HTTP_STATUS.NOT_FOUND.status}: code` });
    }

    if (codeDoc.code !== code) {
      return res.status(HTTP_STATUS.BAD_REQUEST.code).json({ message: `${HTTP_STATUS.BAD_REQUEST.status}: code` });
    }

    if (codeDoc.used) {
      return res.status(HTTP_STATUS.BAD_REQUEST.code).json({ message: `${HTTP_STATUS.BAD_REQUEST.status}: code used` });
    }

    await Code.deleteOne({ _id: codeDoc._id });
    await User.updateOne(
      { _id: userId },
      {
        auth: {
          ...user.auth,
          verified: true,
        },
      }
    );

    getIo().emit("user-updated", userId);

    return res.status(HTTP_STATUS.OK.code).json({ message: HTTP_STATUS.OK.status });
  } catch (err) {
    log(err, "ERROR", "routes POST /auth/verify");
    return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR.code).json({ message: HTTP_STATUS.INTERNAL_SERVER_ERROR.status });
  }
};

const sendCode = async (req, res) => {
  try {
    const { email, phone } = req.body;
    const user = await User.findOne({ $or: [{ email }, { phone }] });
    if (!user) {
      return res.status(HTTP_STATUS.NOT_FOUND.code).json({
        message: `${HTTP_STATUS.NOT_FOUND.status}: user`,
      });
    }

    const otp = generateNumericCode(length);
    const expiry = new Date(Date.now() + expiresIn * 1000);
    await Code.create({ target: email || phone, code: otp, expiry });

    if (!email && !phone) {
      return res.status(HTTP_STATUS.BAD_REQUEST.code).json({
        message: `${HTTP_STATUS.BAD_REQUEST.status}: email or phone`,
      });
    }

    if (email) {
      const htmlTemplate = require("../../config/EmailTemplates/Verification");
      await sendMail(email, "wordle Verification", htmlTemplate.replace("{{verificationCode}}", otp));
      return res.status(HTTP_STATUS.OK.code).json({ message: HTTP_STATUS.OK.status });
    }

    if (phone) {
      await sendVerificationSms(phone, otp);
      return res.status(HTTP_STATUS.OK.code).json({ message: HTTP_STATUS.OK.status });
    }
  } catch (err) {
    log(err, "ERROR", "routes POST /auth/send-code");
    return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR.code).json({ message: HTTP_STATUS.INTERNAL_SERVER_ERROR.status });
  }
};

module.exports = {
  verify,
  sendCode,
};
