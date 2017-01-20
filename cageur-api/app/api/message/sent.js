const router = require('express').Router();
const ctl = require('../message/sent-controller');

/**
* Retrieve all sent message data
* GET /api/v1/message/sent
*/
router.get('/', ctl.getAllSent);

module.exports = router;
