const Result = require("../models/resultSchema");
const excludedGames = require("../data/multipleResultsInSameDay");

module.exports = {

    handleHomeRoute : async (req, res) => {
        try {
          // Fetch the latest result for "Mumbai Starline"
          var resultWithMumbai =
            (await Result.findOne({ game: "Mumbai Starline" }, { _id: 0 }).sort({
              date: -1,
            })) || {};
      
          if (!resultWithMumbai || !resultWithMumbai.date) {
            // Handle the case when no result is found
            console.log("No results found for Mumbai Starline.");
            return res.render("index", {
              data: {},
              time: "N/A",
              timeInMilli: "N/A",
              todayResults: [], // No results for today either
            });
          }
      
          // Format the time for the latest result
          const time = resultWithMumbai.date.toLocaleTimeString().split(":");
          const updatedTime = `${time[0]}:${time[1]}${time[2].split("00").join(" ")}`;
          const timeInMilli = new Date(resultWithMumbai.date).getTime();
      
          // Set today's date and start of the month at the top
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
          // Set time to 00:00:00 to get the start of the day
          today.setHours(0, 0, 0, 0);
          oneDayBefore.setHours(0, 0, 0, 0);
      
          const latestResults = await Result.aggregate([
            {
              $match: {
                game: { $nin: excludedGames }, // Exclude all games from excludedGames
                date: { $gte: oneDayBefore }, // Only fetch results for today and yesterday
              },
            },
            {
              $sort: { date: -1 }, // Sort by latest date first
            },
            {
              $group: {
                _id: "$game", // Group by game
                results: {
                  $push: {
                    result: "$result",
                    date: "$date",
                  },
                }, // Push all results into the array
              },
            },
            {
              $project: {
                game: "$_id",
                results: 1, // Show only game and results
              },
            },
          ]);
          /**********************Other games END **************************** */
          // Format today's results for the table
          const formattedResults = todayResults.map((result) => ({
            time: result.date.toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            }),
            result: result.result, // Assuming 'result' is your field name
          }));
      
          // ***********************Monthly result for index START*************************************
          // Start of the month (1st day of the current month in local time)
          const startOfMonth = new Date(
            todayDate.getFullYear(),
            todayDate.getMonth(),
            1
          );
          // Fetch monthly results
          const monthlyResults = await Result.aggregate([
            {
              $match: {
                game: { $nin: excludedGames }, // Exclude all games from excludedGames
                date: { $gte: startOfMonth, $lte: todayDate }, // Only consider data from start of the month to end
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
      
          // ***********************Monthly result for index END*************************************
      
          // Render the EJS template, passing the data for the latest result and today's results
          res.render("index", {
            data: resultWithMumbai,
            time: updatedTime,
            timeInMilli,
            todayResults: formattedResults, // Pass today's sorted results
            otherGames: latestResults,
            todayDate,
            oneDayBefore,
            monthlyResults,
          });
        } catch (err) {
          console.error("Error fetching results:", err);
          res.status(500).send("Internal Server Error");
        }
      }
}