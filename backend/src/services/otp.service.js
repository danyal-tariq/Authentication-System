const moment = require('moment');
const httpStatus = require('http-status');
const config = require('../config/config');
const userService = require('./user.service');
const { Token } = require('../models');
const ApiError = require('../utils/ApiError');
const { tokenTypes } = require('../config/tokens');

/**
 * Generate a 6-digit OTP
 * @returns {string}
 */
const generateOtp = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

/**
 * Save an OTP
 * @param {string} otp
 * @param {ObjectId} userId
 * @param {Moment} expires
 * @param {string} type
 * @param {boolean} [blacklisted]
 * @returns {Promise<Token>}
 */
const saveOtp = async (otp, userId, expires, type, blacklisted = false) => {
  const tokenDoc = await Token.create({
    token: otp,
    user: userId,
    expires: expires.toDate(),
    type,
    blacklisted,
  });
  return tokenDoc;
};

/**
 * Verify OTP and return token doc (or throw an error if it is not valid)
 * @param {string} otp
 * @param {string} type
 * @returns {Promise<Token>}
 */
const verifyOtp = async (otp, type, user) => {
  const tokenDoc = await Token.findOneAndDelete({
    token: otp,
    type,
    blacklisted: false,
    user: user,
    expires: { $gt: moment().toDate() },
  });
  if (!tokenDoc) {
    throw new ApiError(httpStatus.UNAUTHORIZED, 'OTP not found or expired');
  }
  return tokenDoc;
};

/**
 * Generate OTP for user authentication
 * @param {User} user
 * @returns {Promise<Object>}
 */
const generateAuthOtp = async (email) => {
  const user = await userService.getUserByEmail(email);
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, 'No users found with this email');
  }
  const otpExpires = moment().add(config.otp.expirationMinutes, 'minutes');
  const otp = generateOtp();
  await saveOtp(otp, user.id, otpExpires, tokenTypes.OTP);

  return {
    otp,
    //return expires in minutes
    expires: config.otp.expirationMinutes,
  };
};

module.exports = {
  generateOtp,
  saveOtp,
  verifyOtp,
  generateAuthOtp,
};
