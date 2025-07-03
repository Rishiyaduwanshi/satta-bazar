const { dailyResultSchema } = require("../utils/validation");
const Result = require("../models/resultSchema");
const intervalSlotGames = require("../data/games")
  .filter(g => g.frequency === "interval-slot")
  .map(g => g.name);

const dailyResult = async (req, res) => {
  let { date, game } = req.query;

  const parseResult = dailyResultSchema.safeParse({ date, game });

  if (!parseResult.success) {
    req.flash("error", parseResult.error.errors[0].message);
    return res.redirect("/dailyResult");
  }

  game = game.split("?")[0];

if (!intervalSlotGames.includes(game)) {
  req.flash("error", "Please select a valid game");
  return res.render("dailyResult", {
    game: "",
    fetchResult: [],
    todayDate: new Date().toDateString(),
    messages: req.flash(),
  });
}


  try {
    if (!date) {
      return res.redirect(
        `/dailyResult?game=${game}&date=${new Date().toISOString().substring(0, 10)}`
      );
    }

    const d = new Date(date);
    const startOfDayUTC = new Date(d.setHours(0, 0, 0, 0));
    const endOfDayUTC = new Date();

    const fetchResult = await Result.find({
      game,
      date: { $gte: startOfDayUTC, $lte: endOfDayUTC },
    }).sort({ date: -1 })

    const todayDate = d.toDateString();

    res.render("dailyResult", {
      game,
      fetchResult: fetchResult || [],
      todayDate,
      intervalSlotGames,
      messages: req.flash()
    });
  } catch (err) {
    console.error("Error fetching result:", err);
    res
      .status(501)
      .send(`Internal server error ${require("../utils/errorCodes").c46}`);
  }
};

module.exports = dailyResult;
