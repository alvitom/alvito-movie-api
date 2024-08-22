const express = require("express");
const router = express.Router();
const { register, login, forgotPassword, verifyOtp, logout, addUserInfo, resetPassword } = require("../controllers/auth");
const { validateRegister, validateLogin, validateEmail, validateOtp, validateAddUserInfo, validatePassword } = require("../middlewares/validationMiddleware");
const { auth, isAuthenticated } = require("../middlewares/auth");

router.post("/register", validateRegister, register);
router.post("/verify_otp", validateOtp, verifyOtp);
router.post("/add_user_info", validateAddUserInfo, addUserInfo);
router.post("/login", validateLogin, isAuthenticated, login);
router.post("/logout", auth, logout);
router.post("/forgot-password", validateEmail, isAuthenticated, forgotPassword);
router.post("/reset-password/:resetToken", validatePassword, resetPassword);

module.exports = router;
