const Result = require("../models/resultSchema");

const manageResults = async (req, res) => {
  try {
    const { game, date } = req.query;
    let query = {};

    if (game) query.game = game;
    if (date) {
      const startDate = new Date(date);
      const endDate = new Date(date);
      endDate.setDate(endDate.getDate() + 1);
      query.date = { $gte: startDate, $lt: endDate };
    }

    const games = await Result.distinct("game");
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
