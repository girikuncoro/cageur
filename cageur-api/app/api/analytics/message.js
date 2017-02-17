const router = require('express').Router();
const ctl = require('../analytics/message-controller');
const { isAuthorized } = require('../../middleware');

/**
* Retrieve all message analytics data
* GET /api/v1/analytics/message
*/
router.get('/', isAuthorized.superAdmin, ctl.getAllMessage);

/**
* Retrieve all message analytics data from clinicID
* GET /api/v1/analytics/message/clinic/:id
*/
router.get('/clinic/:clinic_id', isAuthorized.clinicSelf, ctl.getAllMessageWithClinicID);

module.exports = router;
