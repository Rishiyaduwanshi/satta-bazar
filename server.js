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


app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

app.use(
  session({
    secret: process.env.SECRET_KEY,
    resave: false,
    saveUninitialized: false,
    cookie : { secure : false, maxAge : 1000*60*60*24}
  })
);
app.use(flash());


// **********************Routes************************* 
app.use('/', require('./routes/home.route'))
app.use('/', require('./routes/signup.route'))
app.use('/', require('./routes/signin.route'))
app.use('/', require('./routes/submitResult.route'))
app.use('/', require('./routes/monthlyResult.route'))
app.use('/', require('./routes/dailyResult.route'))
app.use('/', require('./routes/manageResults.route'))
app.use('/', require('./routes/deleteResult.route'))


app.all("/*splat", (req, res) => {
  res.status(404).render("404"); 
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
