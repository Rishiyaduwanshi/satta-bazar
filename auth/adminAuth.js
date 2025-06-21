const Admin = require("../models/adminSchema");
const jwt = require('jsonwebtoken'); // Corrected the import
const bcrypt = require("bcrypt");

const signin = async (req,res,next) =>{
  try {
    const { usernameOrEmail, password } = req.body;

    // Find admin by email or username
    const fetchAdmin = await Admin.findOne({
      $or: [{ email: usernameOrEmail }, { username: usernameOrEmail }],
    });

    // Check if admin exists
    if (!fetchAdmin) {
      req.flash("error", "Invalid credentials");
      return res.redirect("/signin");
    }

    const isMatch = await bcrypt.compare(password, fetchAdmin.password);

    if (!isMatch) {
      // If password does not match
      req.flash("error", "Invalid credentials");
      return res.redirect("/signin");
    }
    createToken({ username: fetchAdmin.username }, '0.5h', res); // Pass `res` here to set the cookie

    // Successful login
    req.flash("success", "Login successful!");
    return res.redirect("/submitresult");
  } catch (err) {
    // Handle any errors
    req.flash("error", "An error occurred during login.");
    console.log(err);
    return res.redirect("/signin");
  }
}

const createToken = (payload, expiry, res) => {
  try {
    // Directly sign the token and set it as a cookie
    const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: expiry });
    res.cookie('token', token, { httpOnly: true, secure: process.env.PRO_MODE === 'true', sameSite : 'strict', 'maxAge' : 15 * 60 * 100 });
    res.cookie('isLoggedIn', true, { 'maxAge': 15 * 60 * 1000 })
    return token; // Return the token if needed
  } catch (error) {
    console.error("Could not tokenize: ", error);
    throw new Error("Token generation failed");
  }
}
module.exports = {
  signin,
  createToken
};
