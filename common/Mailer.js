const { log } = require("./Logger");
const { isPhone } = require("./Validator");
const { getE164Phone } = require("./StringUtils");
const { MailerSend, Sender, EmailParams, Recipient } = require("mailersend");
const { LOCALE } = require("../enum/Locale");

/**
 *
 * This function sends an SMS message using Twilio API
 * @param {string} to Recipient phone number
 * @param {LOCALE} locale 2-letter country code uppercased, for example LOCALE.VIETNAM or LOCALE.UNITED_STATES
 * @param {*} message Sms content
 * @throws {Error} If the phone number is invalid
 *
 * @example
 * sendSms("+123456789", "US", "Hello, World!");
 */
const sendSms = async (to, locale, message) => {
  try {
    if (!isPhone(to, locale)) {
      throw new Error(`Invalid phone number ${to}`);
    }
    const client = require("twilio")(process.env.TWILIO_SID, process.env.TWILIO_TOKEN);
    await client.messages.create({
      body: message,
      // from: process.env.TWILIO_PHONE,
      messagingServiceSid: process.env.TWILIO_SERVICE,
      to,
    });
  } catch (err) {
    log(err, "ERROR", "Mailer");
  }
};

/**
 *
 * @param {*} to
 * @param {*} locale
 */
const sendVerificationSms = async (to, locale) => {
  try {
    if (!isPhone(to, locale)) {
      throw new Error(`Invalid phone number ${to}`);
    }
    const phone = getE164Phone(to, locale);
    // log env variables
    log(`TWILIO_SID: ${process.env.TWILIO_SID}`, "INFO", "Mailer");
    log(`TWILIO_TOKEN: ${process.env.TWILIO_TOKEN}`, "INFO", "Mailer");
    log(`TWILIO_SERVICE: ${process.env.TWILIO_SERVICE}`, "INFO", "Mailer");
    const client = require("twilio")(process.env.TWILIO_SID, process.env.TWILIO_TOKEN);
    client.verify.v2
      .services(process.env.TWILIO_SERVICE)
      .verifications.create({ to: phone, channel: "sms" })
      .then((verification) => log(JSON.stringify(verification.toJSON()), "WARN", "Mailer"))
      .catch((err) => log(err, "ERROR", "Mailer"));
  } catch (err) {
    log(err, "ERROR", "Mailer");
  }
};

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
  sendSms,
  sendVerificationSms,
};
