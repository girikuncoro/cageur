const router = require('express').Router();
const ctl = require('../message/schedule-controller');

/**
* Scheduling message to be sent later
* POST /api/v1/message/schedule/clinic/:id
*/
router.post('/clinic/:id', ctl.scheduleMessage);

/**
* Fetch all scheduled messages
* GET /api/v1/message/schedule
*/
router.get('/', ctl.getAllScheduledMessages);

/**
* Fetch all scheduled messages by clinic ID
* GET /api/v1/message/schedule/clinic/:id
*/
router.get('/clinic/:id', ctl.getScheduledMessagesByClinicID);

/**
* Fetch one scheduled message
* GET /api/v1/message/schedule/:id
*/
router.get('/:id', ctl.getSingleScheduledMessage);

/**
* Remove scheduled message
* GET /api/v1/message/schedule/:id
*/
router.delete('/:id', ctl.removeScheduledMessage);

module.exports = router;
