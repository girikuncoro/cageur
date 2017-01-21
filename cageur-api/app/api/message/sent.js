const router = require('express').Router();
const ctl = require('../message/sent-controller');

/**
* Retrieve all sent message data
* GET /api/v1/message/sent
*/
router.get('/', ctl.getAllSent);

/**
* Retrieve all sent message data from clinicID
* GET /api/v1/message/sent/clinic/:id
*/
router.get('/clinic/:id', ctl.getAllSentWithClinicID);

module.exports = router;
