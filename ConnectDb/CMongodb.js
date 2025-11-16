const mongoose = require("mongoose");

/**
 * @description Establishes a connection to the MongoDB database using Mongoose.
 * It uses the connection string from the environment variables.
 * In case of a connection error, it logs the error and exits the process.
 */
const connectDB = async () => {
  try {
    // The useNewUrlParser and useUnifiedTopology options are no longer needed
    // in recent versions of Mongoose. They are handled by default.
    const conn = await mongoose.connect(process.env.MONGODB_URI);

    // Log a success message with the host of the connected database.
    console.log(`MongoDB Connected: ${conn.connection.host} `);
  } catch (error) {
    // Log the error message in case of a connection failure and exit the application.
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

module.exports = connectDB;
