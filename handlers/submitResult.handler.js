const Result = require("../models/resultSchema");
const gameList = require("../data/games");

function isTimeBetween(start, end, input) {
  const toMinutes = (timeStr) => {
    const [h, m] = timeStr.split(":").map(Number);
    return h * 60 + m;
  };

  const startMin = toMinutes(start);
  const endMin = toMinutes(end);
  const inputMin = toMinutes(input);

  return inputMin >= startMin && inputMin <= endMin;
}

function isValidGame(gameName, gameList) {
  return gameList.some((g) => g.name === gameName);
}


module.exports = {
  getResult: (req, res) => {
    res.render("submitResult", {
      gameList: gameList.map((g) => g.name),
      success: req.flash("success"),
      error: req.flash("error"),
      signupSuccess: req.flash("signupSuccess"),
    });
  },

  createResult: async (req, res) => {
    try {
      const { game, date, result, time } = req.body;
        if (result > 100 || result < 0) {
          req.flash("error", "Result should be in between 0 and 100");
          res.redirect("/submitResult");
        }
      if (!isValidGame(game, gameList)) {
        req.flash("error", "The game you entered is not valid"),
          res.redirect("/submitResult");
        return;
      }
      const selectedGame = gameList.find((g) => g.name === game);
      if (selectedGame.frequency === "interval-slot") {
        const { start, end } = selectedGame.intervalSlot;

        if (!isTimeBetween(start, end, time)) {
          req.flash(
            "error",
            `${game} is only allowed between ${start} and ${end}`
          );
          return res.redirect("/submitResult");
        }
      }
      let dateObject = new Date(date + "T" + time);
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
