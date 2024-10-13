const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
  const token = req.cookies.token; // Get token from cookies

  // Check if token exists
  if (!token) {
    req.flash("error", "Access denied. Please login.");
    return res.redirect("/signin");
  }

  try {
    // Verify the token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Attach the decoded user info to the request object (optional)
    req.user = decoded; // Now you can access `req.user` in protected routes

    next(); // Proceed to the next middleware or route handler
  } catch (err) {
    req.flash("error", "Invalid or expired token. Please login again.");
    return res.redirect("/signin");
  }
};
