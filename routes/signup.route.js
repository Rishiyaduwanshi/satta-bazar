const router = require("express").Router();

const { getSignup, postSignup } = require("../handlers/signup.handler");
//api/users route
router
  .route("/signup")
  .get(getSignup)
  .post(require("../middlewares/adminCount"), postSignup);

module.exports = router;

