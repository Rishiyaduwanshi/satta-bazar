
const Admin = require('../models/adminSchema');
const bcrypt = require('bcrypt');

module.exports = {
  signin: async (req, res, next) => {
    try {
      const { usernameOrEmail, password } = req.body;

      // Find admin by email or username
      const fetchAdmin = await Admin.findOne({
        $or: [{ email: usernameOrEmail }, { username: usernameOrEmail }]
      });
      
      const isMatch = await bcrypt.compare(password, fetchAdmin.password);

      if (!fetchAdmin || !isMatch) {
        // If admin is not found
        req.flash('error', 'Invalid credentials');
        return res.redirect('/signin');
      }

      // Successful login
      req.flash('success', 'Login successful!');
      return res.redirect('/submitresult');


    } catch (err) {
      // Handle any errors
      req.flash('error', 'An error occurred during login.');
      return res.redirect('/signin');
    }
  }
};
