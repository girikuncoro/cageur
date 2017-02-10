const router = require('express').Router();
const ctl = require('../bank/controller');

/**
* Insert Bank data
* POST /api/v1/bank
*/
router.post('/', ctl.createBank);

/**
* Retrieve all Bank data
* GET /api/v1/bank
*/
router.get('/', ctl.getAllBank);

/**
* Retrieve single Bank data
* GET /api/v1/bank/:id
*/
router.get('/:id', ctl.getSingleBank);

/**
* Update Bank data
* PUT /api/v1/bank/:id
*/
router.put('/:id', ctl.updateBank);

/**
* Remove Bank
* DELETE /api/v1/bank/:id
*/
router.delete('/:id', ctl.removeBank);

module.exports = router;
