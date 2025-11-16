const mongoose = require("mongoose");

// Define the schema for the User model
const userSchema = new mongoose.Schema(
  {
    // User's name with validation for presence, trimming, and length
    name: {
      type: String,
      required: [true, "Please add a name"],
      trim: true, // Removes whitespace from both ends of a string
      maxlength: [50, "Name cannot be more than 50 characters"],
    },
    // User's email with validation for presence, uniqueness, and format
    email: {
      type: String,
      required: [true, "Please add an email"],
      unique: true, // Ensures email is unique across all users
      lowercase: true, // Converts email to lowercase before saving
      match: [
        /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
        "Please add a valid email",
      ],
    },
    // User's password with validation for presence and minimum length
    password: {
      type: String,
      required: [true, "Please add a password"],
      minlength: [6, "Password must be at least 6 characters"],
      select: false, // Don't return password by default
    },
    resetPasswordToken: String,
    resetPasswordExpire: Date,
  },
  {
    // Mongoose option to automatically add createdAt and updatedAt timestamps
    timestamps: true,
  }
);

// Create and export the User model
const User = mongoose.model("User", userSchema);

module.exports = User;
