const Result = require("../models/resultSchema");
const games = require('../data/gameList');

const manageResults = async (req, res) => {
  try {
    const { game, date } = req.query;
    let query = {'game' : {$in : games}};

    if (game) query.game = game;
    if (date && !isNaN(new Date(date))) {
      const startDate = new Date(date);
      const endDate = new Date(date);
      endDate.setDate(endDate.getDate() + 1);
      query.date = { $gte: startDate, $lt: endDate };
    }

    const results = await Result.find(query).sort({ date: -1 }).limit(100);
    res.render("manageResults", {
      games,
      results,
      selectedGame: game || "",
      selectedDate: date || "",
      moment: require("moment"),
    });
  } catch (err) {
    console.error("Error fetching results:", err);
    res.status(500).send("Internal Server Error");
  }
};

module.exports = manageResults;
