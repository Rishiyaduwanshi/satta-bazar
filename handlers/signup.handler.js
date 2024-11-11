const adminSchema = require("../models/adminSchema");
const { logError } = require("../utils/log");

module.exports = {
  getSignup: (req, res) => {
    const adminCountError = req.flash("adminCountError");
    res.render("adminSignup", { adminCountError });
  },

  postSignup: async (req, res) => {
    try {
      const { createToken } = require("../auth/adminAuth");
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
  },
};
