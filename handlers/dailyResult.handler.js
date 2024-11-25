const Result = require("../models/resultSchema");
const gameList = require("../data/gameList");

const dailyResult = async (req, res) => {
  const { date } = req.query;
  try {
    if (typeof date == "undefined") {
      res.redirect(
        `/dailyResult/?date=${new Date().toISOString().substring(0, 10)}`
      );
    }
    if (typeof date === "string") {
      const d = new Date(date);
      const startOfDayUTC = new Date(d.setHours(0, 0, 0, 0)); // Start at 00:00:00
      const endOfDayUTC = new Date(d.setHours(23, 59, 59, 999)); // End at 23:59:59

      const fetchResult = await Result.find({
        game: "Super Faridabad",
        date: { $gte: startOfDayUTC, $lte: endOfDayUTC },
      }).sort({ date: 1 });

      const todayDate = d.toDateString();      

      res.render("dailyResult", {
        data: gameList,
        fetchResult,
        todayDate,
      });
    }
  } catch (err) {
    console.error("Error fetching result:", err);
    res
      .status(501)
      .send(`Internal server error ${require("../utils/errorCodes").c46}`);
  }
};

module.exports = dailyResult;
