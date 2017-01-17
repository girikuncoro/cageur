const router = require('express').Router();
const ctl = require('../clinic/controller');

/**
* Insert clinic data
* POST /api/v1/clinic
*/
router.post('/', ctl.createClinic);

/**
* Retrieve all clinic data
* GET /api/v1/clinic
*/
router.get('/', ctl.getAllClinic);

/**
* Retrieve single clinic data
* GET /api/v1/clinic/:id
*/
router.get('/:id', ctl.getSingleClinic);

/**
* Update clinic data
* PUT /api/v1/clinic/:id
*/
router.put('/:id', ctl.updateClinic);

/**
* Remove clinic
* DELETE /api/v1/clinic/:id
*/
router.delete('/:id', ctl.removeClinic);

module.exports = router;
