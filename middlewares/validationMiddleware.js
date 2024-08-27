const jwt = require("jsonwebtoken");
const httpResponse = require("../utils/httpResponse");

const validateRegister = (req, res, next) => {
  const { email, password, confirmPassword } = req.body;
  let errors = {};

  if (!email) {
    errors.email = errors.email || [];
    errors.email.push("Email is required");
  }

  if (!password) {
    errors.password = errors.password || [];
    errors.password.push("Password is required");
  }

  if (!confirmPassword) {
    errors.confirmPassword = errors.confirmPassword || [];
    errors.confirmPassword.push("Confirm Password is required");
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (!emailRegex.test(email)) {
    errors.email = errors.email || [];
    errors.email.push("Invalid email address");
  }

  const passwordLowercaseRegex = /^(?=.*[a-z])/;
  const passwordUppercaseRegex = /^(?=.*[A-Z])/;
  const passwordNumberRegex = /^(?=.*[0-9])/;
  const passwordSymbolRegex = /^(?=.*[@$!%^*?&()\-_=+[{\]};:,<.>|~])/;

  if (!passwordLowercaseRegex.test(password)) {
    errors.password = errors.password || [];
    errors.password.push("Password must contain at least one lowercase letter");
  }
  if (!passwordUppercaseRegex.test(password)) {
    errors.password = errors.password || [];
    errors.password.push("Password must contain at least one uppercase letter");
  }
  if (!passwordNumberRegex.test(password)) {
    errors.password = errors.password || [];
    errors.password.push("Password must contain at least one number");
  }
  if (!passwordSymbolRegex.test(password)) {
    errors.password = errors.password || [];
    errors.password.push("Password must contain at least one symbol");
  }
  if (password?.length < 6 || password?.length > 20) {
    errors.password = errors.password || [];
    errors.password.push("Password must be between 6 and 20 characters");
  }

  if (password !== confirmPassword) {
    errors.confirmPassword = errors.confirmPassword || [];
    errors.confirmPassword.push("Passwords do not match");
  }

  if (Object.keys(errors).length > 0) {
    return httpResponse(res, "Validation Error", { errors }, 400);
  }

  next();
};

const validateOtp = (req, res, next) => {
  const { ALVITO_MOVIE_OTP } = req.cookies;
  const { ALVITO_MOVIE_USER } = req.cookies;
  let errors = {};

  if (!req.body.otp) {
    errors.otp = errors.otp || [];
    errors.otp.push("OTP is required");
  }

  if (req.body.otp?.toString().length !== 6) {
    errors.otp = errors.otp || [];
    errors.otp.push("OTP must be 6 digits");
  }

  if (Object.keys(errors).length > 0) {
    return httpResponse(res, "Validation Error", { errors }, 400);
  }

  if (!ALVITO_MOVIE_OTP) {
    return httpResponse(res, "Request failed with status code 404", { error: "OTP not found or expired" }, 404);
  }

  const { otp } = jwt.verify(ALVITO_MOVIE_OTP, process.env.JWT_SECRET);

  if (otp !== req.body.otp || otp === undefined) {
    return httpResponse(res, "Request failed with status code 401", { error: "Invalid OTP" }, 401);
  }

  if (!ALVITO_MOVIE_USER) {
    return httpResponse(res, "Request failed with status code 404", { error: "User not found" }, 404);
  }

  const user = jwt.verify(ALVITO_MOVIE_USER, process.env.JWT_SECRET);
  req.user = user;

  next();
};

const validateAddUserInfo = (req, res, next) => {
  const { name } = req.body;
  const { ALVITO_MOVIE_TOKEN } = req.cookies;
  let errors = {};

  if (!name) {
    errors.name = errors.name || [];
    errors.name.push("Name is required");
  }

  if (name?.length > 50) {
    errors.name = errors.name || [];
    errors.name.push("Name must be less than 50 characters");
  }

  if (Object.keys(errors).length > 0) {
    return httpResponse(res, "Validation Error", { errors }, 400);
  }

  if (!ALVITO_MOVIE_TOKEN) {
    return httpResponse(res, "Request failed with status code 404", { error: "Token not found" }, 404);
  }

  const user = jwt.verify(ALVITO_MOVIE_TOKEN, process.env.JWT_SECRET);
  req.user = user;

  next();
};

const validateLogin = (req, res, next) => {
  const { email, password } = req.body;
  let errors = {};

  if (!email) {
    errors.email = "Email is required";
  }

  if (!password) {
    errors.password = "Password is required";
  }

  if (Object.keys(errors).length > 0) {
    return httpResponse(res, "Validation Error", { errors }, 400);
  }

  next();
};

const validateEmail = (req, res, next) => {
  const { email } = req.body;
  let errors = {};

  if (!email) {
    errors.email = errors.email || [];
    errors.email.push("Email is required");
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    errors.email = errors.email || [];
    errors.email.push("Invalid email format");
  }

  if (Object.keys(errors).length > 0) {
    return httpResponse(res, "Validation Error", { errors }, 400);
  }

  next();
};

const validatePassword = (req, res, next) => {
  const { password, confirmPassword } = req.body;
  let errors = {};

  if (!password) {
    errors.password = errors.password || [];
    errors.password.push("Password is required");
  }

  if (!confirmPassword) {
    errors.confirmPassword = errors.confirmPassword || [];
    errors.confirmPassword.push("Confirm Password is required");
  }

  const passwordLowercaseRegex = /^(?=.*[a-z])/;
  const passwordUppercaseRegex = /^(?=.*[A-Z])/;
  const passwordNumberRegex = /^(?=.*[0-9])/;
  const passwordSymbolRegex = /^(?=.*[@$!%^*?&()\-_=+[{\]};:,<.>|~])/;

  if (!passwordLowercaseRegex.test(password)) {
    errors.password = errors.password || [];
    errors.password.push("Password must contain at least one lowercase letter");
  }
  if (!passwordUppercaseRegex.test(password)) {
    errors.password = errors.password || [];
    errors.password.push("Password must contain at least one uppercase letter");
  }
  if (!passwordNumberRegex.test(password)) {
    errors.password = errors.password || [];
    errors.password.push("Password must contain at least one number");
  }
  if (!passwordSymbolRegex.test(password)) {
    errors.password = errors.password || [];
    errors.password.push("Password must contain at least one symbol");
  }

  if (password?.length < 6 || password?.length > 20) {
    errors.password = errors.password || [];
    errors.password.push("Password must be between 6 and 20 characters");
  }

  if (confirmPassword !== password) {
    errors.confirmPassword = errors.confirmPassword || [];
    errors.confirmPassword.push("Passwords do not match");
  }

  if (Object.keys(errors).length > 0) {
    return httpResponse(res, "Validation Error", { errors }, 400);
  }

  next();
};

const validateSearch = (req, res, next) => {
  const { q } = req.query;
  let errors = {};

  if (!q) {
    errors.search = errors.search || [];
    errors.search.push("Input search is required");
  }

  if (q?.length > 50) {
    errors.search = errors.search || [];
    errors.search.push("Input search must be less than 50 characters");
  }

  if (q?.length < 3) {
    errors.search = errors.search || [];
    errors.search.push("Input search must be more than 3 characters");
  }

  if (Object.keys(errors).length > 0) {
    return httpResponse(res, "Validation Error", { errors }, 400);
  }

  next();
};

const validateWatchlist = (req, res, next) => {
  const { mediaType, mediaId } = req.body;
  let errors = {};

  if (!mediaType) {
    errors.mediaType = errors.mediaType || [];
    errors.mediaType.push("Media Type is required");
  }

  if (!mediaId) {
    errors.mediaId = errors.mediaId || [];
    errors.mediaId.push("Media Id is required");
  }

  if (typeof mediaType !== "string") {
    errors.mediaType = errors.mediaType || [];
    errors.mediaType.push("Media Type must be a string");
  }

  if (mediaType.toLowerCase() !== "movie" && mediaType.toLowerCase() !== "tv") {
    errors.mediaType = errors.mediaType || [];
    errors.mediaType.push("Media Type must be 'movie' or 'tv'");
  }

  if (typeof mediaId !== "number") {
    errors.mediaId = errors.mediaId || [];
    errors.mediaId.push("Media Id must be a number");
  }

  if (mediaId <= 0) {
    errors.mediaId = errors.mediaId || [];
    errors.mediaId.push("Media Id must be greater than 0");
  }

  if (Object.keys(errors).length > 0) {
    return httpResponse(res, "Validation Error", { errors }, 400);
  }

  next();
};

const validateChangePassword = (req, res, next) => {
  const { oldPassword, newPassword, confirmPassword } = req.body;
  let errors = {};

  if (!oldPassword) {
    errors.oldPassword = errors.oldPassword || [];
    errors.oldPassword.push("Old Password is required");
  }

  if (!newPassword) {
    errors.newPassword = errors.newPassword || [];
    errors.newPassword.push("New Password is required");
  }

  if (!confirmPassword) {
    errors.confirmPassword = errors.confirmPassword || [];
    errors.confirmPassword.push("Confirm Password is required");
  }

  if (newPassword?.length < 6 || newPassword?.length > 20) {
    errors.newPassword = errors.newPassword || [];
    errors.newPassword.push("New Password must be between 6 and 20 characters");
  }

  const passwordLowercaseRegex = /^(?=.*[a-z])/;
  const passwordUppercaseRegex = /^(?=.*[A-Z])/;
  const passwordNumberRegex = /^(?=.*[0-9])/;
  const passwordSymbolRegex = /^(?=.*[@$!%^*?&()\-_=+[{\]};:,<.>|~])/;

  if (!passwordLowercaseRegex.test(newPassword)) {
    errors.newPassword = errors.newPassword || [];
    errors.newPassword.push("New Password must contain at least one lowercase letter");
  }

  if (!passwordUppercaseRegex.test(newPassword)) {
    errors.newPassword = errors.newPassword || [];
    errors.newPassword.push("New Password must contain at least one uppercase letter");
  }

  if (!passwordNumberRegex.test(newPassword)) {
    errors.newPassword = errors.newPassword || [];
    errors.newPassword.push("New Password must contain at least one number");
  }

  if (!passwordSymbolRegex.test(newPassword)) {
    errors.newPassword = errors.newPassword || [];
    errors.newPassword.push("New Password must contain at least one symbol");
  }

  if (newPassword !== confirmPassword) {
    errors.confirmPassword = errors.confirmPassword || [];
    errors.confirmPassword.push("Passwords do not match");
  }

  if (oldPassword === newPassword) {
    errors.newPassword = errors.newPassword || [];
    errors.newPassword.push("New Password must be different from Old Password");
  }

  if (Object.keys(errors).length > 0) {
    return httpResponse(res, "Validation Error", { errors }, 400);
  }

  next();
};

module.exports = { validateRegister, validateOtp, validateAddUserInfo, validateLogin, validateEmail, validatePassword, validateSearch, validateWatchlist, validateChangePassword };
