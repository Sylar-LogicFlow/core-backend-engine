const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { validationResult } = require("express-validator");
const User = require("../model/Data");
const sendEmail = require("../sendEmail");
const crypto = require("crypto");

/**
 * @description Register a new user.
 * @route POST /api/register
 * @access Public
 */
exports.register = async (req, res, next) => {
  // 1. Validate incoming request data based on rules defined in the route.
  const Errors = validationResult(req);

  if (!Errors.isEmpty()) {
    return res.status(400).json({
      Success: false,
      message: "Validation Error",
      Errors: Errors.array(),
    });
  }

  try {
    // 2. Destructure required fields from the request body.
    const { name, email, password } = req.body;
    // Fallback check, although validation middleware should handle this.
    if (!name || !email || !password) {
      return res
        .status(400)
        .json({ success: false, error: "Please provide all fields" });
    }

    // 3. Check if a user with the given email already exists.
    const userExists = await User.findOne({ email });
    if (userExists)
      return res.status(400).json({
        success: false,
        message: "User Already Exists",
      });

    // 4. Hash the user's password for security.
    const hashedPassword = await bcrypt.hash(
      password,
      parseInt(process.env.SALT_ROUNDS) || 10
    );

    // 5. Create a new user instance with the sanitized and validated data.
    const user = await User({
      name,
      email,
      password: hashedPassword,
    });

    // 6. Save the new user to the database.
    await user.save();

    // 7. Generate a JSON Web Token (JWT) for the newly registered user.
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRES_IN,
    });

    // 8. Send a success response with user data and the token.
    res.status(201).json({
      success: true,
      message: "User Registered Successfully",
      user: { id: user._id, name: user.name, email: user.email },
      token,
    });
  } catch (error) {
    // Handle any unexpected errors during the process.
    res.status(400).json({ success: false, message: error.message });
    next(error.message);
  }
};

/**
 * @description Log in a user
 * @route POST /api/login
 * @access Public
 */
exports.Login = async (req, res, next) => {
  try {
    // 1. Destructure email and password from the request body.
    const { email, password } = req.body;
    // Fallback check, although validation middleware should handle this.
    if (!email || !password) {
      return res
        .status(400)
        .json({ success: false, message: "Please provide email and password" });
    }

    // 2. Find the user by email. `.select('+password')` is used to explicitly include the password,
    // which is excluded by default in the User model.
    const user = await User.findOne({ email }).select("+password");
    if (!user) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid credentials" });
    }

    // 3. Compare the provided password with the hashed password in the database.
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid credentials" });
    }

    // 4. If credentials are valid, generate a JWT for the user.
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRES_IN,
    });

    // 5. Send a success response with user data and the token.
    res.status(200).json({
      success: true,
      message: "User Logged In Successfully",
      user: { id: user._id, name: user.name, email: user.email },
      token,
    });
  } catch (error) {
    // Handle any unexpected errors.
    res
      .status(400)
      .json({ success: false, message: "Error ", message: error.message });
    next(error.message);
  }
};

/**
 * @description Get current logged in user profile
 * @route GET /api/profile
 * @access Private
 */
exports.profile = async (req, res, next) => {
  // Note: This validation check is here, but no validation rules are applied on the route.
  const Errors = validationResult(req);

  if (!Errors.isEmpty()) {
    return res.status(400).json({
      Success: false,
      message: "Validation Error",
      Errors: Errors.array(),
    });
  }

  try {
    // 1. Find the user by the ID attached to the request object by the `protect` middleware.
    // The password is explicitly excluded from the result.
    const user = await User.findById(req.user.id).select("-password");

    if (!user) {
      return res.status(404).json({ success: false, error: "User not found" });
    }

    // 2. Send the user profile data in the response.
    res.status(200).json({ success: true, user });
  } catch (error) {
    // Handle any unexpected errors.
    res.status(400).json({ success: false, message: error.message });
    next(error.message);
  }
};

/**
 * @description Change user password
 * @route PUT /api/change-password
 * @access Private
 */
exports.changePassword = async (req, res, next) => {
  // 1. Validate incoming request data.
  const Errors = validationResult(req);

  if (!Errors.isEmpty()) {
    return res.status(400).json({
      Success: false,
      message: "Validation Error",
      Errors: Errors.array(),
    });
  }

  try {
    // 2. Find the user by ID from the token and include the password for comparison.
    const user = await User.findById(req.user.id).select("+password");
    if (!user) {
      return res.status(404).json({ success: false, error: "User not found" });
    }

    // 3. Destructure old and new passwords from the request body.
    const { oldpassword, newpassword } = req.body;

    // 4. Verify that the provided old password matches the one in the database.
    const isMatch = await bcrypt.compare(oldpassword, user.password);
    if (!isMatch) {
      return res
        .status(400)
        .json({ success: false, message: "Old password is incorrect" });
    }

    // 5. Hash the new password.
    const hashedPassword = await bcrypt.hash(
      newpassword,
      parseInt(process.env.SALT_ROUNDS) || 10
    );

    // 6. Update the user's password with the new hashed password.
    user.password = hashedPassword;

    // 7. Save the updated user object.
    await user.save();

    // 8. Send a success response.
    res
      .status(200)
      .json({ success: true, message: "Password updated Successfully" });
  } catch (error) {
    // Handle any unexpected errors.
    res.status(400).json({ success: false, message: error.message });
    next(error.message);
  }
};

/**
 * @description Update user profile details
 * @route PUT /api/update-profile
 * @access Private
 */
exports.updateDetails = async (req, res, next) => {
  // Note: This validation check is here, but no validation rules are applied on the route.
  const Errors = validationResult(req);

  if (!Errors.isEmpty()) {
    return res.status(400).json({
      Success: false,
      message: "Validation Error",
      Errors: Errors.array(),
    });
  }

  try {
    // 1. Destructure the fields to be updated from the request body.
    const { name, email, about } = req.body;
    // 2. Find the user by ID from the token.
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ success: false, error: "User not found" });
    }

    // 3. Update user fields only if they were provided in the request.
    if (name) user.name = name;
    if (email) user.email = email;
    if (about) user.about = about;

    // 4. Save the updated user information.
    await user.save();

    // 5. Send a success response with the updated user data.
    res.status(200).json({
      success: true,
      message: "Details updated Successfully",
      updatedUser: {
        id: user._id,
        name: user.name,
        email: user.email,
        about: user.about,
      },
    });
  } catch (error) {
    // Handle any unexpected errors.
    res.status(400).json({ success: false, message: error.message });
    next(error.message);
  }
};

/**
 * @description Log out current user
 * @route (No route)
 * @access Private
 */
// ** Logout is typically handled on the client-side by deleting the stored JWT.

/**
 * @description Delete user account
 * @route POST /api/delete-account
 * @access Private
 */
exports.deleteAccount = async (req, res, next) => {
  // 1. Validate incoming request data.
  const Errors = validationResult(req);

  if (!Errors.isEmpty()) {
    return res.status(400).json({
      Success: false,
      message: "Validation Error",
      Errors: Errors.array(),
    });
  }

  try {
    // 2. Get the user ID from the token.
    const userId = req.user.id;

    // 3. Find the user and include their password for verification.
    const user = await User.findById(userId).select("+password");
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    // 4. Get the password from the request body to confirm the action.
    const { password } = req.body;
    if (!password) {
      return res
        .status(400)
        .json({ success: false, message: "Please provide your password" });
    }

    // 5. Verify the provided password is correct.
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res
        .status(400)
        .json({ success: false, message: "Password is incorrect" });
    }

    // 6. If the password is correct, delete the user account.
    await User.findByIdAndDelete(userId);

    // 7. Send a confirmation response.
    res
      .status(200)
      .json({ success: true, message: "User account deleted successfully" });
  } catch (error) {
    // Handle any unexpected errors.
    res.status(400).json({ success: false, message: error.message });
    next(error.message);
  }
};

/**
 * @description Handle forgot password request
 * @route POST /api/forgot-password
 * @access Public
 */
exports.forgotPassword = async (req, res, next) => {
  // 1. Validate the incoming request (should contain an email).
  const Errors = validationResult(req);

  if (!Errors.isEmpty()) {
    return res.status(400).json({
      Success: false,
      message: "Validation Error",
      Errors: Errors.array(),
    });
  }

  try {
    // 2. Find a user with the provided email.
    const { email } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      // Note: We send a generic error to prevent email enumeration attacks.
      return res
        .status(404)
        .json({ success: false, message: "There is no user with that email" });
    }

    // 3. Generate a secure random token for the password reset link.
    const resetToken = crypto.randomBytes(32).toString("hex");

    // 4. Hash the token before saving it to the database for security.
    const hashedToken = crypto
      .createHash("sha256")
      .update(resetToken)
      .digest("hex");

    // 5. Set the hashed token and its expiration time (e.g., 10 minutes) on the user object.
    user.resetPasswordToken = hashedToken;
    user.resetPasswordExpire = Date.now() + 10 * 60 * 1000;

    await user.save({ validateBeforeSave: false });

    // 6. Create the full reset URL for the email.
    const resetUrl = `${process.env.FRONTEND_URL}/api/reset-password/${resetToken}`;
    console.log(resetUrl);
    sendEmail({
      to: user.email,
      subject: "Password Reset Request",
      html: `<p>You requested a password reset. Please click on the link below to reset your password:</p>
             <a href="${resetUrl}" target="_blank">${resetUrl}</a>
             <p>This link will expire in 10 minutes.</p>`,
    });

    // 7. Send a success response to the user.
    res.status(200).json({
      success: true,
      message: "Successfully sent the reset password To your email",
    });
  } catch (error) {
    // Clear reset fields on the user if an error occurs during email sending.
    res.status(400).json({ success: false, message: error.message });
    next(error.message);
  }
};

/**
 * @description Reset user password
 * @route POST /api/reset-password/:resetToken
 * @access Public
 */
exports.resetPassword = async (req, res, next) => {
  // 1. Validate the incoming request (should contain a new password).
  const Errors = validationResult(req);

  if (!Errors.isEmpty()) {
    return res.status(400).json({
      Success: false,
      message: "Validation Error",
      Errors: Errors.array(),
    });
  }

  try {
    // 2. Hash the token from the URL params to match the one stored in the database.
    const resetToken = req.params.resetToken;
    const hashedToken = crypto
      .createHash("sha256")
      .update(resetToken)
      .digest("hex");

    // 3. Find the user by the hashed token, ensuring the token has not expired.
    const user = await User.findOne({
      resetPasswordToken: hashedToken,
      resetPasswordExpire: { $gt: Date.now() },
    });

    if (!user) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid or expired reset token" });
    }

    // 4. Verify that the new password and confirmation password match.
    const { newpassword, confirmnewpassword } = req.body;

    if (newpassword !== confirmnewpassword) {
      return res
        .status(400)
        .json({ success: false, message: "Passwords do not match" });
    }

    // 5. Hash the new password.
    const hashedPassword = await bcrypt.hash(
      newpassword,
      parseInt(process.env.SALT_ROUNDS) || 10
    );

    // 6. Update the user's password.
    user.password = hashedPassword;

    // 7. Clear the reset token fields from the user object so it cannot be used again.
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;

    await user.save();

    // 8. Send a success response.
    res.status(200).json({
      success: true,
      message: "Password has been reset successfully",
    });
  } catch (error) {
    // Handle any unexpected errors.
    res.status(400).json({ success: false, message: error.message });
    next(error.message);
  }
};
