const router = require("express").Router();

router.get(
  "/manageResults",
  require("../auth/isLoginAuth"),
  require("../handlers/manageResults.handler")
);

module.exports = router;