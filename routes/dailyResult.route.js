const router = require('express').Router();


router.get('/dailyresult',require('../handlers/dailyResult.handler'))

module.exports = router;