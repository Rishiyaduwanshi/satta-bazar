const adminSchema = require("../models/adminSchema");
const { logError } = require("../utils/log");

module.exports = {
  getSignin: (req, res) => {
    const error = req.flash("error");
    const success = req.flash("success");
    res.render("adminSignin", { error, success });
  },

  postSignin: (req,res) =>{}
};
