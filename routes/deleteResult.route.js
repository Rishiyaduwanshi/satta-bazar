
const router = require("express").Router();

router.delete(
  "/deleteResult/:id",
  require("../auth/isLoginAuth"),
  require("../handlers/deleteResult.handler")
);


module.exports = router;
