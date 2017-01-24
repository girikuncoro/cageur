const router = require('express').Router();
const ctl = require('../analytics/message-controller');

/**
* Retrieve all message analytics data
* GET /api/v1/analytics/message
*/
// router.get('/', ctl.getAllMessage);

/**
* Retrieve all message analytics data from clinicID
* GET /api/v1/analytics/message/clinic/:id
*/
router.get('/clinic/:id', ctl.getAllMessageWithClinicID);

module.exports = router;
