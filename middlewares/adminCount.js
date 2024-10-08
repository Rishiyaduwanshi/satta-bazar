const adminSchema = require("../models/adminSchema");

const checkAdminCount = async (req, res, next) => {
  try {
    // Fetch the admin count directly from the database
    const adminCount = await adminSchema.countDocuments();

    // Check if the admin limit is reached
    if (adminCount >= 1) {
      req.flash("adminCountError", "You are not allowed to signup");
      return res.redirect("/signup");
    }

    // Check if the username already exists
    const usernameExists = await adminSchema.findOne({
      username: req.body.username,
    });

    if (usernameExists) {
      req.flash(
        "adminCountError",
        "Username already exists. Please choose a different one."
      );
      return res.redirect("/signup");
    }

    // Check if the email already exists
    const emailExists = await adminSchema.findOne({ email: req.body.email });

    if (emailExists) {
      req.flash(
        "adminCountError",
        "Email already exists. Please use a different one."
      );
      return res.redirect("/signup");
    }

    // Proceed to the next middleware or route handler
    next();
  } catch (err) {
    console.error("Error checking admin details", err);
    res.status(500).send("Internal Server Error in count");
  }
};

module.exports = checkAdminCount;
