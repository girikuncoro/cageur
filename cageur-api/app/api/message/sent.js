const router = require('express').Router();
const ctl = require('../message/sent-controller');
const { isAuthorized } = require('../../middleware');

/**
* Retrieve all sent message data
* GET /api/v1/message/sent
*/
router.get('/', isAuthorized.superAdmin, ctl.getAllSent);

/**
* Retrieve all sent message data from clinicID
* GET /api/v1/message/sent/clinic/:id
*/
router.get('/clinic/:clinic_id', isAuthorized.clinicSelf, ctl.getAllSentWithClinicID);

/**
* Retrieve all sent message data
* GET /api/v1/message/sent
*/
router.get('/:id', isAuthorized.superAdmin, ctl.getSingleSent);

/**
* Retrieve all sent message data with clinicID
* GET /api/v1/message/sent/:id/clinic/:id
*/
router.get('/:id/clinic/:clinic_id', isAuthorized.clinicSelf, ctl.getSingleSentWithClinicID);

module.exports = router;
