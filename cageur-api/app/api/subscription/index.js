const router = require('express').Router();
const ctl = require('../subscription/controller');

/**
* Insert Subscription data
* POST /api/v1/subscription
*/
router.post('/', ctl.createSubscription);

/**
* Retrieve all Subscription data
* GET /api/v1/subscription
*/
router.get('/', ctl.getAllSubscription);

/**
* Retrieve single Subscription data
* GET /api/v1/subscription/:id
*/
router.get('/:id', ctl.getSingleSubscription);

/**
* Update Subscription data
* PUT /api/v1/subscription/:id
*/
router.put('/:id', ctl.updateSubscription);

/**
* Remove Subscription
* DELETE /api/v1/subscription/:id
*/
router.delete('/:id', ctl.removeSubscription);

module.exports = router;
