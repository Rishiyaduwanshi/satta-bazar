const mongoose = require("mongoose");

const connect = require("../dbConnection");

const resultSchema = new mongoose.Schema(
  {
    game: {
      type: String,
    },
    date: {
      type: Date,
    },
    result: {
      type: Number,
    },
  },
  {
    timestamps: true,
  }
);

const Result = connect.sattaStarlineDB.model("results", resultSchema);
module.exports = Result;
