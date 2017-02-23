const router = require('express').Router();
const ctl = require('../message/schedule-controller');
const { isAuthorized } = require('../../middleware');

/**
* Scheduling message to be sent later
* POST /api/v1/message/schedule/clinic/:id
*/
router.post('/clinic/:id', isAuthorized.clinicSelf, ctl.scheduleMessage);

/**
* Fetch all scheduled messages
* GET /api/v1/message/schedule
*/
router.get('/', isAuthorized.superAdmin, ctl.getAllScheduledMessages);

/**
* Fetch all scheduled messages by clinic ID
* GET /api/v1/message/schedule/clinic/:id
*/
router.get('/clinic/:clinic_id', isAuthorized.clinicSelf, ctl.getScheduledMessagesByClinicID);

/**
* Fetch one scheduled message
* GET /api/v1/message/schedule/:id
*/
router.get('/:id', isAuthorized.superAdmin, ctl.getSingleScheduledMessage);

/**
* Fetch one scheduled message with clinic ID
* GET /api/v1/message/schedule/:id/clinic/:id
*/
router.get('/:id/clinic/:clinic_id', isAuthorized.clinicSelf, ctl.getSingleScheduledMessageWithClinicID);

/**
* Remove scheduled message
* GET /api/v1/message/schedule/:id
*/
router.delete('/:id', isAuthorized.superAdmin, ctl.removeScheduledMessage);

/**
* Remove scheduled message with clinic ID
* GET /api/v1/message/schedule/:id/clinic/:id
*/
router.delete('/:id/clinic/:clinic_id', isAuthorized.clinicSelf, ctl.removeScheduledMessageWithClinicID);

module.exports = router;
