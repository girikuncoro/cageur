const router = require('express').Router();
const ctl = require('../bank/controller');
const { isAuthorized } = require('../../middleware');

/**
* Insert Bank data
* POST /api/v1/bank
*/
router.post('/', isAuthorized.superAdmin, ctl.createBank);

/**
* Retrieve all Bank data
* GET /api/v1/bank
*/
router.get('/', isAuthorized.superAdmin, ctl.getAllBank);

/**
* Retrieve single Bank data
* GET /api/v1/bank/:id
*/
router.get('/:id', isAuthorized.superAdmin, ctl.getSingleBank);

/**
* Update Bank data
* PUT /api/v1/bank/:id
*/
router.put('/:id', isAuthorized.superAdmin, ctl.updateBank);

/**
* Remove Bank
* DELETE /api/v1/bank/:id
*/
router.delete('/:id', isAuthorized.superAdmin, ctl.removeBank);

module.exports = router;
