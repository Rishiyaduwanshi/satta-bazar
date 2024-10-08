const mongoose = require("mongoose");
require("dotenv").config();

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI);

// Access the default connection
const db = mongoose.connection;

// Event listeners for connection status
db.on("connected", () => {
  console.log("Connected to database...");
});

db.on("error", (err) => {
  console.error("Error in connecting to database:", err);
});

db.on("disconnected", () => {
  console.log("Disconnected from database...");
});

// Export the connection object
module.exports = db;
