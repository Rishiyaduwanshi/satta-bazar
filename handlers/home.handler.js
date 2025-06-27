const Result = require("../models/resultSchema");
const excludedGames = require("../data/multipleResultsInSameDay");
const games = require("../data/games")

async function fetchTopResultPerGame() {
  try {
    const intervalSlotGames = games
      .filter((game) => game.frequency === "interval-slot")
      .map(g => g.name)


    const results = await Result.aggregate([
      { $match: { game: { $in: intervalSlotGames } } },
      { $sort: { game: 1, date: -1 } },
      {
        $group: {
          _id: "$game",
          date: { $first: "$date" },
          result: { $first: "$result" },
        },
      },
    ]);

    const finalResult = results.map(r => {
      const matchingGame = games.find(g => g.name === r._id);
      return {
        id: matchingGame?.id, 
        name: matchingGame?.name,
        intervalSlot: matchingGame?.intervalSlot || "",
        result: r.result,
        date: r.date
      };
    });

    return finalResult;
  } catch (error) {
    console.log(error);
    return "Errror in fetching result"
  }
}

module.exports = {

    handleHomeRoute : async (req, res) => {
        try {
          var resultWithMumbai =
            (await Result.findOne({ game: "Mumbai Starline" }, { _id: 0 }).sort({
              date: -1,
            })) || {};
      
          if (!resultWithMumbai || !resultWithMumbai.date) {
            console.log("No results found for Mumbai Starline.");
            return res.render("index", {
              data: {},
              time: "N/A",
              timeInMilli: "N/A",
              todayResults: [], 
            });
          }

      
          const time = resultWithMumbai.date.toLocaleTimeString().split(":");
          const updatedTime = `${time[0]}:${time[1]}${time[2].split("00").join(" ")}`;
          const timeInMilli = new Date(resultWithMumbai.date).getTime();
      
          const todayDate = new Date();
          const startDate = new Date(
            todayDate.getFullYear(),
            todayDate.getMonth(),
            todayDate.getDate()
          );
      
          const todayResults = await Result.find({
            game: "Mumbai Starline",
            date: { $gte: startDate },
          }).sort({ date: 1 });
      
          /**************************************************Other games  START***************** */
          const today = new Date();
          const oneDayBefore = new Date(today);
          oneDayBefore.setDate(today.getDate() - 1);
          today.setHours(0, 0, 0, 0);
          oneDayBefore.setHours(0, 0, 0, 0);
      
          const latestResults = await Result.aggregate([
            {
              $match: {
                game: { $nin: excludedGames },
                date: { $gte: oneDayBefore }, 
              },
            },
            {
              $sort: { date: -1 }, 
            },
            {
              $group: {
                _id: "$game", 
                results: {
                  $push: {
                    result: "$result",
                    date: "$date",
                  },
                }, 
              },
            },
            {
              $project: {
                game: "$_id",
                results: 1, 
              },
            },
          ]);
          /**********************Other games END **************************** */
          
          const formattedResults = todayResults.map((result) => ({
            time: result.date.toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            }),
            result: result.result,
          }));
      
          // ***********************Monthly result for index START*************************************
          const startOfMonth = new Date(
            todayDate.getFullYear(),
            todayDate.getMonth(),
            1
          );
          const monthlyResults = await Result.aggregate([
            {
              $match: {
                game: { $nin: excludedGames },
                date: { $gte: startOfMonth, $lte: todayDate }, 
              },
            },
            {
              $sort: { date: -1 }, 
            },
            {
              $group: {
                _id: "$game",
                resultsByDay: {
                  $push: {
                    date: "$date",
                    result: "$result",
                  },
                },
              },
            },
          ]);
      
          // ***********************Monthly result for index END*************************************
      
          res.render("index", {
            data: resultWithMumbai,
            // time: updatedTime,
            // timeInMilli,
            todayResults: formattedResults, 
            otherGames: latestResults,
            todayDate,
            oneDayBefore,
            monthlyResults,
            demo : await fetchTopResultPerGame()
          });
        } catch (err) {
          console.error("Error fetching results:", err);
          res.status(500).send("Internal Server Error");
        }
      }
}