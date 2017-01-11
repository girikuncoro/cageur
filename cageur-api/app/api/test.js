// intiate modules that we need
let router = require('express').Router();
let bodyParser = require('body-parser');

// load queries module
let db = require('./queries');

// middleware of bodyParser
router.use(bodyParser.urlencoded({ extended: true })); 
router.use(bodyParser.json()); 

router.get('/', (req, res) => {
  res.send('Hello world from Cageur! inside of API folder');
});

// routing url for clinic
router.get('/api/v1/clinic', db.getAllClinic);
router.get('/api/v1/clinic/:id', db.getSingleClinic);
router.post('/api/v1/clinic', db.createClinic);
router.put('/api/v1/clinic/:id', db.updateClinic);
router.delete('/api/v1/clinic/:id', db.removeClinic);

// router url for patient
router.get('/api/v1/patient', db.getAllPatient);
router.get('/api/v1/patient/:id', db.getSinglePatient);
router.post('/api/v1/patient', db.createPatient);
router.put('/api/v1/patient/:id', db.updatePatient);
router.delete('/api/v1/patient/:id', db.removePatient);

// router url for disease_group
router.get('/api/v1/disease_group', db.getAllDiseaseGroup);
router.get('/api/v1/disease_group/:id', db.getSingleDiseaseGroup);
router.post('/api/v1/disease_group', db.createDiseaseGroup);
router.put('/api/v1/disease_group/:id', db.updateDiseaseGroup);
router.delete('/api/v1/disease_group/:id', db.removeDiseaseGroup);

// router url for patient_disease_group
router.get('/api/v1/patient_disease_group', db.getAllPatientDiseaseGroup);
router.get('/api/v1/patient_disease_group/:id', db.getSinglePatientDiseaseGroup);
router.post('/api/v1/patient_disease_group', db.createPatientDiseaseGroup);
router.put('/api/v1/patient_disease_group/:id', db.updatePatientDiseaseGroup);
router.delete('/api/v1/patient_disease_group/:id', db.removePatientDiseaseGroup);

module.exports = router;
