const jwt = require("jsonwebtoken");
const User = require("../model/Data");

/**
 * @description Middleware to protect routes that require authentication.
 * It verifies the JWT from the Authorization header and attaches the user to the request object.
 */

const protect = async (req, res, next) => {
  try {
    let token;

    // 1. Check for the Authorization header and ensure it's a Bearer token.
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer")
    ) {
      // Extract the token from the "Bearer <token>" string.
      token = req.headers.authorization.split(" ")[1];
    }

    // 2. If no token is found, the user is not authenticated.
    if (!token) {
      return res.status(401).json({
        success: false,
        error: "Not authorized. Please log in to get access.",
      });
    }

    // 3. Verify the token using the secret key.
    // This will throw an error if the token is invalid or expired.
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // 4. Find the user associated with the token's ID.
    // We exclude the password field from the result for security.
    req.user = await User.findById(decoded.id);

    // 5. Check if the user still exists in the database.
    // This handles cases where a user might have been deleted after the token was issued.
    if (!req.user) {
      return res.status(401).json({
        success: false,
        error: "The user belonging to this token no longer exists.",
      });
    }

    // 6. If everything is okay, proceed to the next middleware or route handler.
    next();
  } catch (error) {
    // This catch block handles errors from jwt.verify (e.g., invalid signature, expired token).
    return res.status(401).json({
      success: false,
      error: "Invalid or expired token",
    });
  }
};

module.exports = protect;
