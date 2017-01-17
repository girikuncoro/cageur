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


// router url for patient_disease_group
router.get('/api/v1/patient_disease_group', db.getAllPatientDiseaseGroup);
router.get('/api/v1/patient_disease_group/:id', db.getSinglePatientDiseaseGroup);
router.post('/api/v1/patient_disease_group', db.createPatientDiseaseGroup);
router.put('/api/v1/patient_disease_group/:id', db.updatePatientDiseaseGroup);
router.delete('/api/v1/patient_disease_group/:id', db.removePatientDiseaseGroup);

module.exports = router;
