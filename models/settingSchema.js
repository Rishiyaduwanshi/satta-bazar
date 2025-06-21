const mongoose = require("mongoose");

const connect = require("../dbConnection");

const settingSchema = new mongoose.Schema(
  {
    showMonthlyResult : Boolean,
    maintenanceMode : Boolean,
    updatedAt: { type: Date, default: Date.now }
  }
);

module.exports = connect.sattaStarlineDB.model("setting", settingSchema);

