const router = require('express').Router();
const ctl = require('../users/controller');

/**
* Insert Users data
* POST /api/v1/users
*/
router.post('/', ctl.createUser);

/**
* Retrieve all Users data
* GET /api/v1/users
*/
router.get('/', ctl.getAllUser);

/**
* Retrieve single Users data
* GET /api/v1/users/:id
*/
router.get('/:id', ctl.getSingleUser);

/**
* Update Users data
* PUT /api/v1/users/:id
*/
router.put('/:id', ctl.updateUser);


/**
* Remove Users
* DELETE /api/v1/users/:id
*/
router.delete('/:id', ctl.removeUser);

module.exports = router;
