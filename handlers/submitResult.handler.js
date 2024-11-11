const Result = require("../models/resultSchema");
const gameList = require("../data/gameList");

module.exports = {
  getResult: (req, res) => {
    res.render("submitResult", {
      gameList,
      success: req.flash("success"),
      error: req.flash("error"),
      signupSuccess: req.flash("signupSuccess"),
    });
  },

  createResult: async (req, res) => {
    const { game, date, result, time } = req.body;
    const dateObject = new Date(date + "T" + time);

    try {
      const newResult = new Result({
        game,
        date: dateObject,
        result,
      });
      await newResult.save();
      req.flash("success", "Result submitted successfully!");
      res.redirect("/submitResult");
    } catch (err) {
      console.error("Error submitting result:", err);
      req.flash("error", "Could not save result");
      res.redirect("/submitResult");
    }
  },
};
