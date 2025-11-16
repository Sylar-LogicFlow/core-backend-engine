const nodemailer = require("nodemailer");

/**
 * @description Sends an email using Nodemailer with credentials from environment variables.
 * @param {object} options - The email options.
 * @param {string} options.to - The recipient's email address.
 * @param {string} options.subject - The subject of the email.
 * @param {string} options.html - The HTML body of the email.
 */

const sendEmail = async (options) => {
  // 1. Create a transporter object using SMTP transport.
  // We are using Mailtrap for testing, but this can be configured for any SMTP service.
  const transporter = nodemailer.createTransport({
    host: process.env.MAIL_HOST,
    port: process.env.MAIL_PORT,
    auth: {
      user: process.env.MAIL_USER,
      pass: process.env.MAIL_PASS,
    },
  });

  // 2. Define the email options.
  const mailOptions = {
    from: `${process.env.MAIL_FROM_NAME} <${process.env.MAIL_FROM_ADDRESS}>`,
    to: options.to,
    subject: options.subject,
    html: options.html,
  };

  // 3. Send the email and log the result.
  const info = await transporter.sendMail(mailOptions);

  console.log("Message sent: %s", info.messageId);
};

module.exports = sendEmail;

