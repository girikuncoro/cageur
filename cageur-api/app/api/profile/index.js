const router = require('express').Router();
const ctl = require('../profile/controller');
const { isAuthorized } = require('../../middleware');

/**
* Get self profile info
* GET /api/v1/profile
*/
router.get('/', ctl.getSelfProfile);

/**
* Change self password
* PUT /api/v1/profile/password
*/
router.put('/password', ctl.updateSelfPassword);

module.exports = router;
