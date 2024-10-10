const express = require("express");
const path = require("path");
const ejs = require("ejs");
const app = express();
const session = require("express-session");
const flash = require("connect-flash");
require("dotenv").config();
require("./dbConnection");
app.set("view engine", "ejs");
const Result = require("./models/resultSchema");
const gameList = require("./data/gameList");
const adminSchema = require("./models/adminSchema");
const { logError } = require("./utils/log");

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(flash());
app.use(express.static(path.join(__dirname, "public")));

// Session and Flash Middleware
app.use(
  session({
    secret: process.env.SECRET_KEY,
    resave: false,
    saveUninitialized: true,
  })
);

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
    const todayDate = new Date(); // Current date
    todayDate.setHours(23, 59, 59, 999); // Set to the end of the current day

    const startOfMonth = new Date(todayDate); // Start of the month
    startOfMonth.setDate(1); // 1st day of the current month

    // Fetch today's results (sorted by time)
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
    // One day before today
    const oneDayBefore = new Date(startDate);
    oneDayBefore.setDate(startDate.getDate() - 1);

    // Aggregating to get the latest and second latest result per game (excluding "Mumbai Starline")
    const latestResults = await Result.aggregate([
      {
        $match: {
          game: { $ne: "Mumbai Starline" }, // Exclude Mumbai Starline
          date: { $gte: oneDayBefore }, // Only consider today and yesterday's data
        },
      },
      {
        $sort: { date: -1 }, // Sort by latest date first
      },
      {
        $group: {
          _id: "$game", // Group by game
          latestResult: { $first: "$$ROOT" }, // Latest result
          secondLatestResult: { $last: "$$ROOT" }, // Second latest result (yesterday's result)
        },
      },
    ]);

    /**********************Other games END **************************** */

    // ******************************One Month Result START************************

    // Aggregating results for the current month (1st to today)

    const monthlyGameResults = await Result.aggregate([
      {
        $match: {
          game: { $ne: "Mumbai Starline" }, // Exclude Mumbai Starline
          date: { $gte: startOfMonth, $lte: todayDate }, // Only consider data from 1st to today
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

    // console.log('Monthly Results:', JSON.stringify(monthlyGameResults, null, 2));

    // Format today's results for the table
    const formattedResults = todayResults.map((result) => ({
      time: result.date.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
      result: result.result, // Assuming 'result' is your field name
    }));

    // Render the EJS template, passing the data for the latest result and today's results
    res.render("index", {
      data: resultWithMumbai,
      time: updatedTime,
      timeInMilli,
      todayResults: formattedResults, // Pass today's sorted results
      otherGames: latestResults,
      monthlyResults: monthlyGameResults,
      todayDate,
      oneDayBefore,
    });
  } catch (err) {
    console.error("Error fetching results:", err);
    res.status(500).send("Internal Server Error");
  }
});

// const isAdmin = () =>{

// }

app.get("/submitresult",(req, res) => {
  
  res.render("submitresult", {
    gameList,
    success: req.flash("success"),
    error: req.flash("error"),
    signupSuccess: req.flash("signupSuccess"),
  });
});

app.post("/submitresult", require('./middlewares/checkResult'), async (req, res) => {
  const { game, date, result, time } = req.body; // Assume these values are coming from the form
  const dateObject = new Date(date + "T" + time);

  try {
    const newResult = new Result({
      game,
      date: dateObject,
      result,
    });
    await newResult.save();
    req.flash("success", "Result submitted successfully!");
    res.redirect("/submitresult");
  } catch (err) {
    console.error("Error submitting result:", err);
    req.flash("error", "Could not save result");
    res.redirect("/submitresult");
  }
});

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

app.get("/api/results", async (req, res) => {
  try {
    const todayDate = new Date();
    const startDate = new Date(
      todayDate.getFullYear(),
      todayDate.getMonth(),
      todayDate.getDate()
    );

    const results = await Result.find({
      game: "Mumbai Starline",
      date: { $gte: startDate },
    }).sort({ date: 1 });

    // Assuming results contain time and number fields
    const formattedResults = results.map((result) => ({
      time: result.time, // Assuming you have 'time' field
      number: result.number, // Assuming you have 'number' field
    }));

    // Render EJS and pass gameName and formattedResults
    res.render("results", {
      gameName: "Mumbai Starline",
      results: formattedResults,
    });
  } catch (err) {
    res.status(501).json({ Error: err, message: "Unable to retrieve data" });
  }
});

app.get("/monthlyresult", async (req, res) => {
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

    res.render("monthlyresult", {
      monthlyResults: monthlyGameResults,
      todayDate: endOfMonth, // Optionally set todayDate to endOfMonth for display
    });
  } catch (err) {
    console.error("Error fetching monthly results:", err);
    res.status(500).send("Internal Server Error");
  }
});

// app.post("/monthlyresult", async (req, res) => {
//   try {

//   } catch (err) {
//     console.error("Error saving result:", err);
//     res.status(500).send("Internal Server Error");
//   }
// });

app.get("/signup", (req, res) => {
  const adminCountError = req.flash("adminCountError");
  res.render("adminsignup", { adminCountError});
});
app.post("/signup", require("./middlewares/adminCount"), async (req, res) => {
  try {
    const { name, email, username, password } = req.body;

    const saveAdmin = new adminSchema({
      name,
      username,
      email,
      password,
    });
    await saveAdmin.save();

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
  const error = req.flash('error');
  const success = req.flash('success');
  res.render("adminsignin", { error, success });
});

app.post("/signin", require('./auth/adminAuth').signin, (req, res) => {

  // Middleware handles redirection, no need for extra logic here.
});

app.get('/dailyResult',(req,res)=>{
  res.render('dailyresult')
})


app.get("*", (req, res) => {
  res.status(404).render("404"); // Render the 404 page with a 404 status code
});

app.listen(process.env.PORT || PORT, () => {
  console.log(
    `Server listening on port ${process.env.PORT || PORT} http://localhost:${
      process.env.PORT || PORT
    }`
  );
});