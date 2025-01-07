const { log } = require("./Logger");

const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: process.env.SMTP_PORT,
  service: process.env.SMTP_SERVICE,
  secure: process.env.SMTP_SECURE === "true", // true for 465 on Google servers
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

/**
 * This function sends an email using Nodemailer
 *
 * @param {string} to Recipient emails
 * @param {string} subject Email subject
 * @param {string} html Email content
 * @throws {Error} If the email is invalid
 */
const sendMail = async (to, subject, html) => {
  if (to === undefined) {
    return;
  }
  try {
    const mailOptions = {
      to: to,
      subject: subject,
      html: html,
    };

    await transporter.sendMail(mailOptions);
  } catch (err) {
    log(JSON.stringify(err), "ERROR", "Mailer");
  }
};

module.exports = {
  sendMail,
};
