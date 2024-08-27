const express = require("express");
const router = express.Router();
const { register, login, forgotPassword, verifyOtp, logout, addUserInfo, resetPassword, updateProfile, showProfile, changePassword, deleteAccount } = require("../controllers/auth");
const { validateRegister, validateLogin, validateEmail, validateOtp, validateAddUserInfo, validatePassword, validateChangePassword } = require("../middlewares/validationMiddleware");
const { auth } = require("../middlewares/auth");

router.post("/register", validateRegister, register);
router.post("/verify_otp", validateOtp, verifyOtp);
router.post("/add_user_info", validateAddUserInfo, addUserInfo);
router.post("/login", validateLogin, login);
router.post("/logout", auth, logout);
router.post("/forgot_password", validateEmail, forgotPassword);
router.post("/reset_password/:resetToken", validatePassword, resetPassword);

router.get("/profile", auth, showProfile);

router.patch("/update_profile", auth, updateProfile);
router.patch("/change_password", auth, validateChangePassword, changePassword);

router.delete("/delete_account", auth, deleteAccount);

module.exports = router;
