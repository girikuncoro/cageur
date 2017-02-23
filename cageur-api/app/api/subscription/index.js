const router = require('express').Router();
const ctl = require('../subscription/controller');
const { isAuthorized } = require('../../middleware');

/**
* Insert Subscription data
* POST /api/v1/subscription
*/
router.post('/', isAuthorized.superAdmin, ctl.createSubscription);

/**
* Retrieve all Subscription data
* GET /api/v1/subscription
*/
router.get('/', isAuthorized.superAdmin, ctl.getAllSubscription);

/**
* Retrieve single Subscription data
* GET /api/v1/subscription/:id
*/
router.get('/:id', isAuthorized.superAdmin, ctl.getSingleSubscription);

/**
* Update Subscription data
* PUT /api/v1/subscription/:id
*/
router.put('/:id', isAuthorized.superAdmin, ctl.updateSubscription);

/**
* Remove Subscription
* DELETE /api/v1/subscription/:id
*/
router.delete('/:id', isAuthorized.superAdmin, ctl.removeSubscription);

module.exports = router;
