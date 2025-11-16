/**
 * @file Defines all the API routes for the application.
 * @module routes/Routes
 */

const { body } = require("express-validator");
const express = require("express");
const router = express.Router();

// Middleware to protect routes that require authentication
const protect = require("../Protection/protect");
// Import controller functions
const Controller = require("../Controller/controllers");

// * --- User Registration ---
// Defines validation rules for the registration endpoint.
const registerValidation = [
  body("name").trim().not().isEmpty().withMessage("Name is required").escape(),
  body("email")
    .isEmail()
    .withMessage("Please include a valid email")
    .normalizeEmail(),
  body("password")
    .isLength({ min: 8 })
    .withMessage("Password must be at least 8 characters"),
];
// Handles new user registration.
router.post("/register", registerValidation, Controller.register);

// * --- User Login ---
// Defines validation rules for the login endpoint.
const loginValidation = [
  body("email")
    .isEmail()
    .withMessage("Please include a valid email")
    .normalizeEmail(),
  body("password").not().isEmpty().withMessage("Password is required"),
];
// Authenticates a user and returns a JWT.
router.post("/login", loginValidation, Controller.Login);

// * --- User Profile ---
// Fetches the profile of the currently authenticated user. (Protected)
router.get("/profile", protect, Controller.profile);

// * --- Password Management ---
// Defines validation rules for changing a password.
const changePasswordValidation = [
  body("oldpassword")
    .not()
    .isEmpty()
    .withMessage("Current password is required"),
  body("newpassword")
    .isLength({ min: 8 })
    .withMessage("New password must be at least 8 characters")
    .custom((value, { req }) => {
      if (value === req.body.oldpassword) {
        throw new Error("New password must be different from the old password");
      }
      return true;
    }),
];
// Allows an authenticated user to change their password. (Protected)
router.put(
  "/change-password",
  changePasswordValidation,
  protect,
  Controller.changePassword
);

// Allows an authenticated user to update their profile details. (Protected)
router.put("/update-profile", protect, Controller.updateDetails);

// * --- Account Deletion ---
// Defines validation rules for deleting an account.
const deleteAccountValidation = [
  body("password")
    .not()
    .isEmpty()
    .withMessage("Password is required to delete account"),
];

// Allows an authenticated user to delete their own account. (Protected)
router.post(
  "/delete-account",
  deleteAccountValidation,
  protect,
  Controller.deleteAccount
);

// * --- Password Reset Flow ---
// Defines validation for the "forgot password" request.
const forgotPasswordValidation = [
  body("email")
    .isEmail()
    .withMessage("Please include a valid email")
    .normalizeEmail(),
];
// Initiates the password reset process by sending a reset token to the user's email.
router.post(
  "/forgot-password",
  forgotPasswordValidation,
  Controller.forgotPassword
);

// Defines validation for the "reset password" action.
const resetPasswordValidation = [
  body("newpassword")
    .isLength({ min: 8 })
    .withMessage("New password must be at least 8 characters"),
];
// Allows a user to set a new password using a valid reset token.
router.post(
  "/reset-password/:resetToken",
  resetPasswordValidation,
  Controller.resetPassword
);

module.exports = router;
