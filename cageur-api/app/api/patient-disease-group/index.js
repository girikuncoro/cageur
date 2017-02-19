const router = require('express').Router();
const ctl = require('../patient-disease-group/controller');
const { isAuthorized } = require('../../middleware');

/**
* Insert patient disease group data
* POST /api/v1/patient_disease_group
*/
router.post('/', isAuthorized.superAdmin, ctl.createPatientDiseaseGroup);

/**
* Retrieve all patient disease group data
* GET /api/v1/patient_disease_group
*/
router.get('/', isAuthorized.superAdmin, ctl.getAllPatientDiseaseGroup);

/**
* Retrieve all patient disease group data with clinic id
* GET /api/v1/patient_disease_group/clinic/:id
*/
router.get('/clinic/:clinic_id', isAuthorized.clinicSelf, ctl.getAllPatientDiseaseGroupWithClinicID);

/**
* Retrieve single patient disease group data
* GET /api/v1/patient_disease_group/:id
*/
router.get('/:id', isAuthorized.superAdmin, ctl.getSinglePatientDiseaseGroup);

/**
* Retrieve single patient disease group data with patient id
* GET /api/v1/patient_disease_group/patient/:id
*/
router.get('/patient/:id', isAuthorized.superAdmin, ctl.getSinglePatientDiseaseGroupWithPatientID);

/**
* Update patient disease group data
* PUT /api/v1/patient_disease_group/:id
*/
router.put('/:id', isAuthorized.superAdmin, ctl.updatePatientDiseaseGroup);

/**
* Remove patient disease group
* DELETE /api/v1/patient_disease_group/:id
*/
router.delete('/:id', isAuthorized.superAdmin, ctl.removePatientDiseaseGroup);

module.exports = router;
