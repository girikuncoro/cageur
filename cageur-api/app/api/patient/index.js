const router = require('express').Router();
const ctl = require('../patient/controller');

/**
* Insert patient data
* POST /api/v1/patient
*/
router.post('/', ctl.createPatient);

/**
* Retrieve all patient data
* GET /api/v1/patient
*/
router.get('/', ctl.getAllPatient);

/**
* Retrieve single patient data
* GET /api/v1/patient/:id
*/
router.get('/:id', ctl.getSinglePatient);

/**
* Update patient data
* PUT /api/v1/patient/:id
*/
router.put('/:id', ctl.updatePatient);

/**
* Remove patient
* DELETE /api/v1/patient/:id
*/
router.delete('/:id', ctl.removePatient);

module.exports = router;
