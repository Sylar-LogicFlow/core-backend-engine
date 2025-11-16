const express = require("express");
const dotenv = require("dotenv");
const helmet = require("helmet");
const cors = require("cors");
const rateLimit = require("express-rate-limit");
const morgan = require("morgan");

// Load environment variables from .env file
dotenv.config();
// Import database connection function
const connectDB = require("./ConnectDb/CMongodb");
// Import main router
const routes = require("./Routes/Routes");

// Establish database connection
connectDB();
const app = express();

// --- Middleware ---

// Body parser: To accept and parse JSON data in the request body.
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(morgan("dev"));

// Set security headers to protect against common vulnerabilities.
app.use(
  helmet({
    contentSecurityPolicy: false, // Disable CSP for compatibility; adjust as needed.
  })
);

// Enable Cross-Origin Resource Sharing (CORS) for all routes.
app.use(cors());

// Rate limiting: To prevent brute-force attacks by limiting request rates.
const limiter = rateLimit({
  windowMs: 10 * 60 * 1000, // 10 minutes
  max: 100, // 100 requests per windowMs
  message: "Too many requests from this IP, please try again later",
});
app.use("/api", limiter);

// --- API Routes ---
app.use("/api", routes);

// --- 404 Not Found Handler ---
// This should be placed after all other routes to catch any unhandled requests.
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: `Route not found`,
  });
});

// --- Server Activation ---
const PORT = process.env.PORT || 5000;
const server = app.listen(PORT, () => {
  console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
});

// --- Global Unhandled Rejection Handler ---
// This catches any unhandled promise rejections in the application,
// logs the error, and gracefully shuts down the server.
process.on("unhandledRejection", (err, promise) => {
  console.log(`Error: ${err.message}`);
  // Close the server and exit the process with a failure code.
  server.close(() => process.exit(1));
});
