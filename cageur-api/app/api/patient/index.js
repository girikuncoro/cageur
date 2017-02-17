const router = require('express').Router();
const ctl = require('../patient/controller');
const { isAuthorized } = require('../../middleware');

/**
* Insert patient data
* POST /api/v1/patient
*/
router.post('/', isAuthorized.superAdmin, ctl.createPatient);

/**
* Retrieve all patient data
* GET /api/v1/patient
*/
router.get('/', isAuthorized.superAdmin, ctl.getAllPatient);

/**
* Retrieve all patient data by clinicID
* GET /api/v1/patient/clinic/:id
*/
router.get('/clinic/:id', isAuthorized.clinicSelf, ctl.getAllPatientByClinicID);

/**
* Retrieve single patient data
* GET /api/v1/patient/:id
*/
router.get('/:id', isAuthorized.superAdmin, ctl.getSinglePatient);

/**
* Update patient data
* PUT /api/v1/patient/:id
*/
router.put('/:id', isAuthorized.superAdmin, ctl.updatePatient);

/**
* Remove patient
* DELETE /api/v1/patient/:id
*/
router.delete('/:id', isAuthorized.superAdmin, ctl.removePatient);

module.exports = router;
