const router = require('express').Router();
const ctl = require('../user/controller');
const { isAuthorized } = require('../../middleware');

/**
* Insert User data
* POST /api/v1/user
*/
router.post('/', isAuthorized.superAdmin, ctl.createUser);

/**
* Retrieve all User data
* GET /api/v1/user
*/
router.get('/', isAuthorized.superAdmin, ctl.getAllUser);

/**
* Retrieve single User data
* GET /api/v1/user/:id
*/
router.get('/:id', isAuthorized.superAdmin, ctl.getSingleUser);

/**
* Update User data
* PUT /api/v1/user/:id
*/
router.put('/:id', isAuthorized.superAdmin, ctl.updateUser);


/**
* Remove Users
* DELETE /api/v1/user/:id
*/
router.delete('/:id', isAuthorized.superAdmin, ctl.removeUser);

module.exports = router;
