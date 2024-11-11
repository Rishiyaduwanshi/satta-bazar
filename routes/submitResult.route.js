const router = require("express").Router();

const { getResult, createResult } = require("../handlers/submitResult.handler");
//api/users route
router
  .route("/submitResult")
  .get(require("../auth/isLoginAuth"), getResult)
  .post(require("../middlewares/checkResult"), require("../auth/isLoginAuth"), createResult);

module.exports = router;

