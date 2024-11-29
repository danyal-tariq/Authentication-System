const httpStatus = require('http-status');
const catchAsync = require('../utils/catchAsync');
const { authService, userService, tokenService, emailService, otpService } = require('../services');
const e = require('express');

const register = catchAsync(async (req, res) => {
  const user = await userService.createUser(req.body);
  const tokens = await tokenService.generateAuthTokens(user);
  res.status(httpStatus.CREATED).send({ user, tokens });
});

const login = catchAsync(async (req, res) => {
  const { email, password } = req.body;
  const user = await authService.loginUserWithEmailAndPassword(email, password);

  if (user.twoFactorEnabled) {
    const otp = await otpService.generateAuthOtp(email);
    await emailService.sendOtpEmail(email, otp.otp, otp.expires);
    return res.status(httpStatus.ACCEPTED).send({ message: 'OTP sent to email' }); // Status 202
  }

  const tokens = await tokenService.generateAuthTokens(user);
  res.status(httpStatus.OK).send({ user, tokens }); // Status 200
});

const logout = catchAsync(async (req, res) => {
  await authService.logout(req.body.refreshToken);
  res.status(httpStatus.NO_CONTENT).send();
});

const refreshTokens = catchAsync(async (req, res) => {
  const tokens = await authService.refreshAuth(req.body.refreshToken);
  res.send({ ...tokens });
});

const forgotPassword = catchAsync(async (req, res) => {
  const resetPasswordToken = await tokenService.generateResetPasswordToken(req.body.email);
  await emailService.sendResetPasswordEmail(req.body.email, resetPasswordToken);
  res.status(httpStatus.NO_CONTENT).send();
});

const resetPassword = catchAsync(async (req, res) => {
  await authService.resetPassword(req.query.token, req.body.password);
  res.status(httpStatus.NO_CONTENT).send();
});

const sendVerificationEmail = catchAsync(async (req, res) => {
  const verifyEmailToken = await tokenService.generateVerifyEmailToken(req.user);
  await emailService.sendVerificationEmail(req.user.email, verifyEmailToken);
  res.status(httpStatus.NO_CONTENT).send();
});

const verifyEmail = catchAsync(async (req, res) => {
  await authService.verifyEmail(req.query.token);
  res.status(httpStatus.NO_CONTENT).send();
});

const verifyResetToken = catchAsync(async (req, res) => {
  await authService.verifyResetToken(req.query.token);
  res.status(httpStatus.NO_CONTENT).send();
});

const requestLoginOtp = catchAsync(async (req, res) => {
  const otp = await otpService.generateAuthOtp(req.body.email);
  await emailService.sendOtpEmail(req.body.email, otp.otp, otp.expires);
  res.status(httpStatus.NO_CONTENT).send();
});

const verifyLoginOtp = catchAsync(async (req, res) => {
  const user = await authService.verifyOtp(req.body.otp, req.body.email);
  const tokens = await tokenService.generateAuthTokens(user);
  res.send({ user, tokens });
});

const verifyToken = catchAsync(async (req, res) => {
  await authService.verifyAccessToken(req.body.token);
  res.status(httpStatus.NO_CONTENT).send();
});

module.exports = {
  register,
  login,
  logout,
  refreshTokens,
  forgotPassword,
  resetPassword,
  sendVerificationEmail,
  verifyEmail,
  verifyResetToken,
  requestLoginOtp,
  verifyLoginOtp,
  verifyToken,
};
