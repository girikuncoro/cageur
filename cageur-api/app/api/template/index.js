const router = require('express').Router();
const ctl = require('../template/controller');
const { isAuthorized } = require('../../middleware');

/**
* Insert template data
* POST /api/v1/template
*/
router.post('/', isAuthorized.superAdmin, ctl.createTemplate);

/**
* Retrieve all template data
* GET /api/v1/template
*/
router.get('/', isAuthorized.clinicAny, ctl.getAllTemplate);

/**
* Retrieve single template data
* GET /api/v1/template/:id
*/
router.get('/:id', isAuthorized.clinicAny, ctl.getSingleTemplate);

/**
* Retrieve templates given disease group
* GET /api/v1/template/disease_group/all
* GET /api/v1/template/disease_group/:id
*/
router.get('/disease_group/:id', isAuthorized.clinicAny, ctl.getTemplateByDiseaseGroup);

/**
* Update template
* PUT /api/v1/template/:id
*/
router.put('/:id', isAuthorized.superAdmin, ctl.updateTemplate);

/**
* Remove template
* DELETE /api/v1/template/:id
*/
router.delete('/:id', isAuthorized.superAdmin, ctl.removeTemplate);

module.exports = router;
