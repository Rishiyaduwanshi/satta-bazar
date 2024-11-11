const router = require("express").Router();

router.get("/monthlyResult", require("../handlers/monthlyResult.handler"));

module.exports = router;
