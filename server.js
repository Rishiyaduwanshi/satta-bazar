const express = require("express");
const path = require("path");
require("ejs");
const app = express();
const session = require("express-session");
const flash = require("connect-flash");
const cookieParser = require("cookie-parser");
require("dotenv").config();
require("./dbConnection");
app.set("view engine", "ejs");
const Result = require("./models/resultSchema");
const gameList = require("./data/gameList");
const adminSchema = require("./models/adminSchema");
const { logError } = require("./utils/log");

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));
app.use(
  session({
    secret: process.env.SECRET_KEY,
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false, maxAge: 1000 * 60 * 60 * 24 },
  })
);
app.use(flash());

app.get("/", async (req, res) => {
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
          game: { $ne: "Mumbai Starline" }, // Exclude "Mumbai Starline"
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
          game: { $ne: "Mumbai Starline" }, // Exclude Mumbai Starline
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
});

app.get("/submitResult", require("./auth/isLoginAuth"), (req, res) => {
  res.render("submitResult", {
    gameList,
    success: req.flash("success"),
    error: req.flash("error"),
    signupSuccess: req.flash("signupSuccess"),
  });
});

app.post(
  "/submitresult",
  require("./middlewares/checkResult"),
  require("./auth/isLoginAuth"),
  async (req, res) => {
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
  }
);

// app.get("/api/results", async (req, res) => {
//   try {
//     const todayDate = new Date()
//     const startDate = new Date(todayDate.getFullYear(),todayDate.getMonth(),todayDate.getDate())
//     const results = await Result.find({game : "Mumbai Starline", date : {$gte : startDate}}).sort({date : 1});
//     const formattedResults = results.map(result => ({
//       ...result._doc, // This contains the full document data
//       date: result.date ? result.date.toLocaleString() : null
//     }));

//     res.status(201).json(formattedResults);
//   } catch (err) {
//     res.status(501).json({ Error: err, message: "Unable to retrive data" });
//   }
// });

app.get("/monthlyResult", async (req, res) => {
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
          game: { $ne: "Mumbai Starline" }, // Exclude Mumbai Starline
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
});

app.get("/signup", (req, res) => {
  const adminCountError = req.flash("adminCountError");
  res.render("adminSignup", { adminCountError });
});
app.post("/signup", require("./middlewares/adminCount"), async (req, res) => {
  try {
    const { createToken } = require("./auth/adminAuth");
    const { name, email, username, password } = req.body;

    const saveAdmin = new adminSchema({
      name,
      username,
      email,
      password,
    });
    await saveAdmin.save();

    createToken({ username: username }, "0.5h", res);

    req.flash("signupSuccess", "Signup Successfull");
    res.redirect("/submitResult");
  } catch (err) {
    console.error("Unable to signup", err);
    logError(err, "SIGNUP_ERROR");
    req.flash(
      "signupError",
      "An error occurred during signup. Please try again."
    );
    res.redirect("/signup"); // Redirect to show the signup page with the error
  }
});

app.get("/signin", (req, res) => {
  const error = req.flash("error");
  const success = req.flash("success");
  res.render("adminSignin", { error, success });
});

app.post("/signin", require("./auth/adminAuth").signin, (req, res) => {
  // Middleware handles redirection, no need for extra logic here.
});

// const date = '2024-11-31'
app.get("/dailyResult", async (req, res) => {
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
        game: "Mumbai Starline",
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
      .send(`Internal server error ${require("./utils/errorCodes").c46}`);
  }
});

app.get("/manageResults", require("./auth/isLoginAuth"), async (req, res) => {
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

    const games = await Result.distinct('game');
    const results = await Result.find(query).sort({date: -1}).limit(100);
    
    res.render("manageResults", { 
      games, 
      results,
      selectedGame: game || '',
      selectedDate: date || '',
      moment: require('moment')
    });
  } catch (err) {
    console.error("Error fetching results:", err);
    res.status(500).send("Internal Server Error");
  }
});


app.delete('/deleteResult/:id', require("./auth/isLoginAuth"), async (req, res) => {
  try {
    const resultId = req.params.id;
    const deletedResult = await Result.findByIdAndDelete(resultId);
    if (!deletedResult) {
      return res.status(404).json({ message: 'Result not found' });
    }
    res.json({ message: 'Result deleted successfully' });
  } catch (error) {
    console.error('Error deleting result:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});


app.get("*", (req, res) => {
  res.status(404).render("404"); // Render the 404 page with a 404 status code
});

console.log(`Timezone: ${process.env.TZ}`);
const serverDate = new Date();
console.log(`Current Date and Time in India: ${serverDate.toString()}`);

app.listen(process.env.PORT || PORT, () => {
  console.log(
    `Server listening on port ${process.env.PORT || PORT} http://localhost:${
      process.env.PORT || PORT
    }, Running in ${
      process.env.PRO_MODE === "true" ? "Production" : "Development"
    } mode`
  );
});
