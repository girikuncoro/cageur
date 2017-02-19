const router = require('express').Router();
const ctl = require('../disease-group/controller');
const { isAuthorized } = require('../../middleware');

/**
* Insert disease group data
* POST /api/v1/disease_group
*/
router.post('/', isAuthorized.superAdmin, ctl.createDiseaseGroup);

/**
* Retrieve all disease group data
* GET /api/v1/disease_group
*/
router.get('/', isAuthorized.clinicAny, ctl.getAllDiseaseGroup);

/**
* Retrieve single disease group data
* GET /api/v1/disease_group/:id
*/
router.get('/:id', isAuthorized.superAdmin, ctl.getSingleDiseaseGroup);

/**
* Update disease group data
* PUT /api/v1/disease_group/:id
*/
router.put('/:id', isAuthorized.superAdmin, ctl.updateDiseaseGroup);

/**
* Remove disease group
* DELETE /api/v1/disease_group/:id
*/
router.delete('/:id', isAuthorized.superAdmin, ctl.removeDiseaseGroup);

module.exports = router;
