const router = require('express').Router();
const ctl = require('../user/controller');

/**
* Insert User data
* POST /api/v1/user
*/
router.post('/', ctl.createUser);

/**
* Retrieve all User data
* GET /api/v1/user
*/
router.get('/', ctl.getAllUser);

/**
* Retrieve single User data
* GET /api/v1/user/:id
*/
router.get('/:id', ctl.getSingleUser);

/**
* Update User data
* PUT /api/v1/user/:id
*/
router.put('/:id', ctl.updateUser);


/**
* Remove Users
* DELETE /api/v1/user/:id
*/
router.delete('/:id', ctl.removeUser);

module.exports = router;
