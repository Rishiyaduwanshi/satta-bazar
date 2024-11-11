const router = require("express").Router();
router
  .route("/signin")
  .get(require("../handlers/signin.handler").getSignin)
  .post( require("../auth/adminAuth").signin);

module.exports = router;

