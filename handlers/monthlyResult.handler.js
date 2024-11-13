const Result = require("../models/resultSchema");
const excludedGames = require("../data/multipleResultsInSameDay");

  const monthlyResult = (async (req, res) => {
    try {
      const month = parseInt(req.query.month, 10); // Get the selected month
      const year = parseInt(req.query.year, 10); // Get the selected year

      // Calculate the start and end dates for the selected month
      const startOfMonth = new Date(year, month - 1, 1); // 1st day of the selected month
      const endOfMonth = new Date(year, month, 0); // Last day of the selected month

      // Fetch monthly results
      const monthlyGameResults = await Result.aggregate([
        {
          $match: {
            game: { $nin: excludedGames }, // Exclude all the results from the excluded games
            date: { $gte: startOfMonth, $lte: endOfMonth }, // Only consider data from start of the month to end
          },
        },
        {
          $sort: { date: -1 }, // Sort by latest date first
        },
        {
          $group: {
            _id: "$game", // Group by game
            resultsByDay: {
              $push: {
                date: "$date",
                result: "$result",
              },
            },
          },
        },
      ]);

      res.render("monthlyResult", {
        monthlyResults: monthlyGameResults,
        todayDate: endOfMonth, // Optionally set todayDate to endOfMonth for display
      });
    } catch (err) {
      console.error("Error fetching monthly results:", err);
      res.status(500).send("Internal Server Error");
    }
  })

  module.exports = monthlyResult
