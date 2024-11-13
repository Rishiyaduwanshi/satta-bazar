const mongoose = require("mongoose");
require("dotenv").config();

// Connect to MongoDB
mongoose.sattaStarlineDB = mongoose.createConnection(process.env.MONGO_URI)

mongoose.connect(process.env.MONGO_URI);

// Access the default connection
// const db = mongoose.connection;

// Event listeners for connection status
mongoose.sattaStarlineDB.on("connected", () => {
  console.log("Connected to starline database...");
});

mongoose.sattaStarlineDB.on("error", (err) => {
  console.error("Error in connecting to starline database:", err);
});

mongoose.sattaStarlineDB.on("disconnected", () => {
  console.log("Disconnected from starline database...");
});

// ***************satta-fast database connection******************
mongoose.sattaFastDB = mongoose.createConnection(process.env.MONGO_URI_SATTA_FAST);

// Event listeners for satta-fast database connection status
mongoose.sattaFastDB.on("connected", () => {
  console.log("Connected to satta-fast database...");
});

mongoose.sattaFastDB.on("error", (err) => {
  console.error("Error in connecting to satta-fast database:", err);
});

mongoose.sattaFastDB.on("disconnected", () => {
  console.log("Disconnected from satta-fast database...");
});



// Export the connection object
module.exports = mongoose;
