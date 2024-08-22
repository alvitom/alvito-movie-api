const crypto = require("crypto");
const User = require("../models/user");
const asyncHandler = require("../utils/asyncHandler");
const { generateToken } = require("../config/jwtToken");
const ApiResponse = require("../utils/response");
const generateOtp = require("../utils/otp");
const sendEmail = require("../utils/nodemailer");

const register = asyncHandler(async (req, res) => {
  const { email } = req.body;
  const user = await User.findOne({ email });

  if (user) {
    return ApiResponse.error(res, "Forbidden", { email: "Email already exists" }, 409);
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
  ApiResponse.success(res, { token: signedOtp }, "OTP sent successfully", 200);
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
  ApiResponse.success(res, { id: newUser._id, email: newUser.email, token }, "Registered successfully", 201);
});

const addUserInfo = asyncHandler(async (req, res) => {
  const { id } = req.user;
  const { name } = req.body;
  const findUser = await User.findById(id);

  if (!findUser) {
    return ApiResponse.error(res, "User Not Found", {}, 404);
  }

  const token = generateToken({ id: findUser._id, name, email: findUser.email, expiresIn: "30m" });

  const updatedUser = await User.findByIdAndUpdate(id, { name, refreshToken: token }, { new: true });

  res.cookie("ALVITO_MOVIE_TOKEN", token, { maxAge: 1800000, httpOnly: true });
  ApiResponse.success(res, { id: updatedUser._id, name: updatedUser.name, email: updatedUser.email, token }, "Added User Info successfully", 201);
});

const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  let errors = {};

  if (!user) {
    errors.email = "Email does not exist";
    return ApiResponse.error(res, "Invalid Credentials", errors, 401);
  }

  const isPasswordValid = await user?.matchPassword(password);
  if (!isPasswordValid) {
    errors.password = "Password is incorrect";
    return ApiResponse.error(res, "Invalid Credentials", errors, 401);
  }

  if (user?.id === req?.user?.id) {
    return ApiResponse.error(res, "User Already Logged In", {}, 403);
  }

  const token = generateToken({ id: user._id, name: user.name, email, expiresIn: "30m" });

  await User.findByIdAndUpdate(user._id, { refreshToken: token }, { new: true });

  res.cookie("ALVITO_MOVIE_TOKEN", token, { maxAge: 1800000, httpOnly: true });
  ApiResponse.success(res, { id: user._id, name: user.name, email: user.email, token }, "Logged in successfully", 200);
});

const logout = asyncHandler(async (req, res) => {
  const { ALVITO_MOVIE_TOKEN } = req.cookies;

  if (!ALVITO_MOVIE_TOKEN) {
    return ApiResponse.error(res, "No token in cookies", {}, 401);
  }

  const updatedUser = await User.findOneAndUpdate({ refreshToken: ALVITO_MOVIE_TOKEN }, { refreshToken: "" }, { new: true });

  if (!updatedUser) {
    return ApiResponse.error(res, "User Not Found", {}, 404);
  }

  res.clearCookie("ALVITO_MOVIE_TOKEN");
  ApiResponse.success(res, null, "Logged out successfully", 200);
});

const forgotPassword = asyncHandler(async (req, res) => {
  const { email } = req.body;
  const user = await User.findOne({ email });

  if (!user) {
    let errors = {};
    errors.email = errors.email || [];
    errors.email.push("Email does not exist");
    return ApiResponse.error(res, "Invalid Credentials", errors, 401);
  }

  if (user?.id === req?.user?.id) {
    let errors = {};
    errors.email = errors.email || [];
    errors.email.push("User already logged in");
    return ApiResponse.error(res, "Forbidden", errors, 403);
  }

  const resetToken = await user.createPasswordResetToken();
  await user.save();

  const resetUrl = `${req.protocol}://${req.get("host")}/reset-password/${resetToken}`;

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

  ApiResponse.success(res, { token: resetToken }, "Password reset link sent successfully. Please check your email to reset your password", 200);
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
    return ApiResponse.error(res, "Validation Error", errors, 400);
  }

  user.password = password;
  user.passwordResetToken = undefined;
  user.passwordResetExpires = undefined;
  await user.save();

  ApiResponse.success(res, null, "Password reset successfully", 200);
});

module.exports = { register, verifyOtp, addUserInfo, login, logout, forgotPassword, resetPassword };
