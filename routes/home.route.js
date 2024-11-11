const router = require("express").Router();

//api/users route
router
  .route("/").get(require('../handlers/home.handler').handleHomeRoute);


module.exports = router;
