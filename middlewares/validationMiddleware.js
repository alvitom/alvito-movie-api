const jwt = require("jsonwebtoken");
const ApiResponse = require("../utils/response");

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
    return ApiResponse.error(res, "Validation Error", errors, 400);
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
    return ApiResponse.error(res, "Validation Error", errors, 400);
  }

  if (!ALVITO_MOVIE_OTP) {
    return ApiResponse.error(res, "OTP Not Found or OTP has expired, please try again", {}, 404);
  }

  const { otp } = jwt.verify(ALVITO_MOVIE_OTP, process.env.JWT_SECRET);

  if (otp !== req.body.otp || otp === undefined) {
    errors.otp = errors.otp || [];
    errors.otp.push("Invalid OTP");
    return ApiResponse.error(res, "Unauthorized", errors, 401);
  }

  if (!ALVITO_MOVIE_USER) {
    return ApiResponse.error(res, "User Not Found", {}, 404);
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
    return ApiResponse.error(res, "Validation Error", errors, 400);
  }

  if (!ALVITO_MOVIE_TOKEN) {
    return ApiResponse.error(res, "User Not Found", {}, 404);
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
    return ApiResponse.error(res, "Validation Error", errors, 400);
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
    return ApiResponse.error(res, "Validation Error", errors, 400);
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
    return ApiResponse.error(res, "Validation Error", errors, 400);
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
    return ApiResponse.error(res, "Validation Error", errors, 400);
  }

  next();
};

const validateIdParams = (req, res, next) => {
  const { id } = req.params;
  let errors = {};

  if (isNaN(parseInt(id))) {
    errors.id = errors.id || [];
    errors.id.push("Id must be a number");
  }

  if (parseInt(id) <= 0) {
    errors.id = errors.id || [];
    errors.id.push("Id must be greater than 0");
  }

  if (id.toString().length > 10) {
    errors.id = errors.id || [];
    errors.id.push("Id must be less than 10 characters");
  }

  if (Object.keys(errors).length > 0) {
    return ApiResponse.error(res, "Validation Error", errors, 400);
  }

  next();
};

const validateWatchlist = (req, res, next) => {
  const { movieId } = req.body;
  let errors = {};

  if (!movieId) {
    errors.movieId = errors.movieId || [];
    errors.movieId.push("Movie Id is required");
  }

  if (typeof movieId !== "number") {
    errors.movieId = errors.movieId || [];
    errors.movieId.push("Movie Id must be a number");
  }

  if (movieId <= 0) {
    errors.movieId = errors.movieId || [];
    errors.movieId.push("Movie Id must be greater than 0");
  }

  if (movieId?.toString().length > 10) {
    errors.movieId = errors.movieId || [];
    errors.movieId.push("Movie Id must be less than 10 digits");
  }

  if (Object.keys(errors).length > 0) {
    return ApiResponse.error(res, "Validation Error", errors, 400);
  }

  next();
};

module.exports = { validateRegister, validateOtp, validateAddUserInfo, validateLogin, validateEmail, validatePassword, validateSearch, validateIdParams, validateWatchlist };
