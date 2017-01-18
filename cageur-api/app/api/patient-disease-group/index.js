const router = require('express').Router();
const ctl = require('../patient-disease-group/controller');

/**
* Insert patient disease group data
* POST /api/v1/patient_disease_group
*/
router.post('/', ctl.createPatientDiseaseGroup);

/**
* Retrieve all patient disease group data
* GET /api/v1/patient_disease_group
*/
router.get('/', ctl.getAllPatientDiseaseGroup);

/**
* Retrieve all patient disease group data with clinic id
* GET /api/v1/patient_disease_group/clinic/:id
*/
router.get('/clinic/:id', ctl.getAllPatientDiseaseGroupWithClinicID);

/**
* Retrieve single patient disease group data
* GET /api/v1/patient_disease_group/:id
*/
router.get('/:id', ctl.getSinglePatientDiseaseGroup);

/**
* Retrieve single patient disease group data with patient id
* GET /api/v1/patient_disease_group/patient/:id
*/
router.get('/patient/:id', ctl.getSinglePatientDiseaseGroupWithPatientID);

/**
* Update patient disease group data
* PUT /api/v1/patient_disease_group/:id
*/
router.put('/:id', ctl.updatePatientDiseaseGroup);

/**
* Remove patient disease group
* DELETE /api/v1/patient_disease_group/:id
*/
router.delete('/:id', ctl.removePatientDiseaseGroup);

module.exports = router;
