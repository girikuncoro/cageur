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


// router url for patient
router.get('/api/v1/patient', db.getAllPatient);
router.get('/api/v1/patient/:id', db.getSinglePatient);
router.post('/api/v1/patient', db.createPatient);
router.put('/api/v1/patient/:id', db.updatePatient);
router.delete('/api/v1/patient/:id', db.removePatient);

module.exports = router;
