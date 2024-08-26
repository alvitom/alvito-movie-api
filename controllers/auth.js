const crypto = require("crypto");
const User = require("../models/user");
const asyncHandler = require("../utils/asyncHandler");
const { generateToken } = require("../config/jwtToken");
const httpResponse = require("../utils/httpResponse");
const generateOtp = require("../utils/otp");
const sendEmail = require("../utils/nodemailer");

const register = asyncHandler(async (req, res) => {
  const { email } = req.body;
  const user = await User.findOne({ email });

  if (user) {
    return httpResponse(res, "Request failed with status code 409", { error: "Email is already registered." }, 409);
  }

  const otp = generateOtp();

  const html = `<h1>Account Verification</h1>
    <p>Dear User,</p>
    <p>Your OTP code is <strong>${otp}</strong>. Please use this code to verify your account within the next 10 minutes.</p>
    <p>If you did not request this code, please ignore this email.</p>`;

  const emailContent = {
    to: email,
    subject: "Account Verification",
    html,
  };

  await sendEmail(emailContent);

  const signedOtp = generateToken({ otp, expiresIn: "10m" });
  const data = generateToken({ email, password: req.body.password, expiresIn: "10m" });
  res.cookie("ALVITO_MOVIE_OTP", signedOtp, { maxAge: 600000, httpOnly: true });
  res.cookie("ALVITO_MOVIE_USER", data, { maxAge: 600000, httpOnly: true });
  httpResponse(res, "OTP sent successfully", null, 200);
});

const verifyOtp = asyncHandler(async (req, res) => {
  const user = req.user;

  user.emailVerifiedAt = Date.now();

  const newUser = await User.create(user);

  const token = generateToken({ id: newUser._id, email: newUser.email, expiresIn: "30m" });

  await User.findByIdAndUpdate(newUser._id, { refreshToken: token }, { new: true });

  res.clearCookie("ALVITO_MOVIE_OTP");
  res.clearCookie("ALVITO_MOVIE_USER");

  res.cookie("ALVITO_MOVIE_TOKEN", token, { maxAge: 1800000, httpOnly: true });

  const data = {
    id: newUser._id,
    email: newUser.email,
    token,
  };

  httpResponse(res, "Registered successfully", { result: data }, 201);
});

const addUserInfo = asyncHandler(async (req, res) => {
  const { id } = req.user;
  const { name } = req.body;

  const findUser = await User.findById(id);

  if (!findUser) {
    return httpResponse(res, "Request failed with status code 404", { error: "User not found" }, 404);
  }

  const token = generateToken({ id: findUser._id, name, email: findUser.email, expiresIn: "30m" });

  const updatedUser = await User.findByIdAndUpdate(id, { name, refreshToken: token }, { new: true });

  res.cookie("ALVITO_MOVIE_TOKEN", token, { maxAge: 1800000, httpOnly: true });

  const data = {
    id: updatedUser._id,
    name: updatedUser.name,
    email: updatedUser.email,
    token,
  };

  httpResponse(res, "Added user info successfully", { result: data }, 201);
});

const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });

  if (!user) {
    return httpResponse(res, "Invalid Credentials", { error: "Invalid Email" }, 401);
  }

  const isPasswordValid = await user?.matchPassword(password);

  if (!isPasswordValid) {
    return httpResponse(res, "Invalid Credentials", { error: "Invalid Password" }, 401);
  }

  if (user?.id === req?.user?.id) {
    return httpResponse(res, "Request failed with status code 403", { error: "User already logged in" }, 403);
  }

  const token = generateToken({ id: user._id, name: user.name, email, expiresIn: "30m" });

  await User.findByIdAndUpdate(user._id, { refreshToken: token }, { new: true });

  res.cookie("ALVITO_MOVIE_TOKEN", token, { maxAge: 1800000, httpOnly: true });

  const data = {
    id: user._id,
    name: user.name,
    email: user.email,
    token,
  };

  httpResponse(res, "Logged in successfully", { result: data }, 200);
});

const logout = asyncHandler(async (req, res) => {
  const { ALVITO_MOVIE_TOKEN } = req.cookies;

  if (!ALVITO_MOVIE_TOKEN) {
    return httpResponse(res, "Request failed with status code 404", { error: "Token not found" }, 404);
  }

  const updatedUser = await User.findOneAndUpdate({ refreshToken: ALVITO_MOVIE_TOKEN }, { refreshToken: "" }, { new: true });

  if (!updatedUser) {
    return httpResponse(res, "Request failed with status code 404", { error: "User not found" }, 404);
  }

  res.clearCookie("ALVITO_MOVIE_TOKEN");

  httpResponse(res, "Logged out successfully", null, 200);
});

const forgotPassword = asyncHandler(async (req, res) => {
  const { email } = req.body;

  const user = await User.findOne({ email });

  if (!user) {
    return httpResponse(res, "Invalid Credentials", { error: "Invalid Email" }, 401);
  }

  if (user?.id === req?.user?.id) {
    return httpResponse(res, "Request failed with status code 403", { error: "User already logged in" }, 403);
  }

  const resetToken = await user.createPasswordResetToken();
  await user.save();

  const resetUrl = `${process.env.ALVITO_MOVIE_CLIENT_BASE_URL}/reset-password/${resetToken}`;

  const html = `<h1>Reset Password</h1>
    <p>We received a request to reset your password. Click the button below to reset your password:</p>
    <a href="${resetUrl}" style="display: inline-block; padding: 10px 20px; background-color: #198754; color: #fff; text-decoration: none; border-radius: 4px;">Reset Password</a>
    <p>This link will expire in 10 minutes.</p>
    <p>If you did not request a password reset, please ignore this email.</p>`;

  const emailContent = {
    to: email,
    subject: "Reset Password",
    html,
  };

  await sendEmail(emailContent);

  httpResponse(res, "Password reset link sent successfully. Please check your email to reset your password.", null, 200);
});

const resetPassword = asyncHandler(async (req, res) => {
  const { password } = req.body;
  const { resetToken } = req.params;

  const resetPasswordToken = crypto.createHash("sha256").update(resetToken).digest("hex");

  const user = await User.findOne({ passwordResetToken: resetPasswordToken });

  let errors = {};

  if (!user) {
    errors.resetToken = errors.resetToken || [];
    errors.resetToken.push("Invalid token");
  }

  if (user?.passwordResetExpires < Date.now()) {
    errors.resetToken = errors.resetToken || [];
    errors.resetToken.push("Token has expired");
  }

  if (Object.keys(errors).length > 0) {
    return httpResponse(res, "Unauthorized", { errors }, 401);
  }

  user.password = password;
  user.passwordResetToken = undefined;
  user.passwordResetExpires = undefined;
  await user.save();

  httpResponse(res, "Password reset successfully. Please login with your new password.", null, 200);
});

module.exports = { register, verifyOtp, addUserInfo, login, logout, forgotPassword, resetPassword };
