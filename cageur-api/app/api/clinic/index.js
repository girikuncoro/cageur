const router = require('express').Router();
const ctl = require('../clinic/controller');
const { isAuthorized } = require('../../middleware');

/**
* Insert clinic data
* POST /api/v1/clinic
*/
router.post('/', isAuthorized.superAdmin, ctl.createClinic);

/**
* Retrieve all clinic data
* GET /api/v1/clinic
*/
router.get('/', isAuthorized.superAdmin, ctl.getAllClinic);

/**
* Retrieve single clinic data
* GET /api/v1/clinic/:id
*/
router.get('/:id', isAuthorized.superAdmin, ctl.getSingleClinic);

/**
* Update clinic data
* PUT /api/v1/clinic/:id
*/
router.put('/:id', isAuthorized.superAdmin, ctl.updateClinic);

/**
* Remove clinic
* DELETE /api/v1/clinic/:id
*/
router.delete('/:id', isAuthorized.superAdmin, ctl.removeClinic);

module.exports = router;
