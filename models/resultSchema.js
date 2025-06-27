const mongoose = require("mongoose");

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

 resultSchema.index({game : 1, date : -1})

const Result = mongoose.model("results", resultSchema);
module.exports = Result;
