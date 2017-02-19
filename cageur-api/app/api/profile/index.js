const router = require('express').Router();
const ctl = require('../profile/controller');
const { isAuthorized } = require('../../middleware');

/**
* Get self profile info
* GET /api/v1/profile
*/
router.get('/', ctl.getSelfProfile);

module.exports = router;
