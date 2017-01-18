const router = require('express').Router();
const db = require('../../config/db');
const abort = require('../../util/abort');


/**
* Incoming message from Line webhook
* POST /api/v1/message/incoming
*/
router.post('/', (req, res, next) => {
  // add to patient db

  // validate if phone number

  //

  // ask for phone number
  console.log(JSON.stringify(req.body));
  res.sendStatus(200);
});

module.exports = router;
