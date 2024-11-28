const nodemailer = require('nodemailer');
const config = require('../config/config');
const logger = require('../config/logger');

const transport = nodemailer.createTransport(config.email.smtp);
/* istanbul ignore next */
if (config.env !== 'test') {
  transport
    .verify()
    .then(() => logger.info('Connected to email server'))
    .catch(() => logger.warn('Unable to connect to email server. Make sure you have configured the SMTP options in .env'));
}

/**
 * Send an email
 * @param {string} to
 * @param {string} subject
 * @param {string} text
 * @returns {Promise}
 */
const sendEmail = async (to, subject, text) => {
  const msg = { from: config.email.from, to, subject, text };
  await transport.sendMail(msg);
};

/**
 * Send reset password email
 * @param {string} to
 * @param {string} token
 * @returns {Promise}
 */
const sendResetPasswordEmail = async (to, token) => {
  const subject = 'Reset password';
  // replace this url with the link to the reset password page of your front-end app
  const resetPasswordUrl = `http://localhost:3000/reset-password/${token}`;
  const text = `Dear user,
To reset your password, click on this link: ${resetPasswordUrl}
If you did not request any password resets, then ignore this email.`;
  await sendEmail(to, subject, text);
};

/**
 * Send verification email
 * @param {string} to
 * @param {string} token
 * @returns {Promise}
 */
const sendVerificationEmail = async (to, token) => {
  const subject = 'Email Verification';
  // replace this url with the link to the email verification page of your front-end app
  const verificationEmailUrl = `http://localhost:3000/verify-email?token=${token}`;
  const text = `Dear user,
To verify your email, click on this link: ${verificationEmailUrl}
If you did not create an account, then ignore this email.`;
  await sendEmail(to, subject, text);
};

/**
 * Sends an OTP email to the specified recipient.
 *
 * @param {string} to - The email address of the recipient.
 * @param {string} otp - The one-time password to be sent.
 * @returns {Promise<void>} A promise that resolves when the email has been sent.
 */
const sendOtpEmail = async (to, otp, expires) => {
  const subject = 'Login OTP';
  const text = `
<!DOCTYPE html>
<html>
<head>
    <style>
        body {
            font-family: Arial, sans-serif;
            margin: 0;
            padding: 0;
            background-color: #f9f9f9;
        }
        .email-container {
            max-width: 600px;
            margin: 20px auto;
            background: #ffffff;
            padding: 20px;
            border: 1px solid #ddd;
            border-radius: 8px;
        }
        .email-header {
            text-align: center;
            background-color: #007bff;
            color: #ffffff;
            padding: 15px 0;
            font-size: 24px;
            border-radius: 8px 8px 0 0;
        }
        .email-body {
            color: #333333;
            line-height: 1.6;
            padding: 20px;
        }
        .email-body p {
            margin: 10px 0;
        }
        .otp {
            font-weight: bold;
            font-size: 24px;
            color: #007bff;
            text-align: center;
            display: block;
            margin: 20px 0;
        }
        .email-footer {
            text-align: center;
            font-size: 12px;
            color: #999999;
            margin-top: 20px;
        }
    </style>
</head>
<body>
    <div class="email-container">
        <div class="email-header">Your OTP Code</div>
        <div class="email-body">
            <p>Dear user,</p>
            <p>Your OTP is:</p>
            <div class="otp">${otp}</div>
            <p>It will expire in <strong>${expires} minutes</strong>.</p>
            <p>If you did not request this, please ignore this email.</p>
        </div>
        <div class="email-footer">
            &copy; 2024 Your Company. All rights reserved.
        </div>
    </div>
</body>
</html>
`;

  await sendEmail(to, subject, text);
};

module.exports = {
  transport,
  sendEmail,
  sendResetPasswordEmail,
  sendVerificationEmail,
  sendOtpEmail,
};
