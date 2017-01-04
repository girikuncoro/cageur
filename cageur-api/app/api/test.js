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

// routing url
router.get('/api/clinic', db.getAllClinic);
router.get('/api/clinic/:id', db.getSingleClinic);
router.post('/api/clinic', db.createClinic);
router.put('/api/clinic/:id', db.updateClinic);
router.delete('/api/clinic/:id', db.removeClinic);

router.get('/api/patient', db.getAllPatient);
router.get('/api/patient/:id', db.getSinglePatient);
router.post('/api/patient', db.createPatient);
router.put('/api/patient/:id', db.updatePatient);
router.delete('/api/patient/:id', db.removePatient);



module.exports = router;
