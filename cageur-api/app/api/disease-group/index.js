const router = require('express').Router();
const ctl = require('../disease-group/controller');

/**
* Insert disease group data
* POST /api/v1/disease_group
*/
router.post('/', ctl.createDiseaseGroup);

/**
* Retrieve all disease group data
* GET /api/v1/disease_group
*/
router.get('/', ctl.getAllDiseaseGroup);

/**
* Retrieve single disease group data
* GET /api/v1/disease_group/:id
*/
router.get('/:id', ctl.getSingleDiseaseGroup);

/**
* Update disease group data
* PUT /api/v1/disease_group/:id
*/
router.put('/:id', ctl.updateDiseaseGroup);

/**
* Remove disease group
* DELETE /api/v1/disease_group/:id
*/
router.delete('/:id', ctl.removeDiseaseGroup);

module.exports = router;
