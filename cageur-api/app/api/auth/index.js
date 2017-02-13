/**
* API TOKEN JWT
* generate token with your user credential that taken from db
* if the condition match, it should return JWT code.
* you need to use it everytime you want to access the restricted pages.
*
* HOW TO PASS JWT CODE
*
* in headers, you need to pass this
* Authorization : JWT <token>
* Example :
* Authorization : JWT eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpZCI6MX0.N0D7YmoU7HJQ9MSQ15QmSLhbPhCplNfaI8haFBfmu2s
*
*/
const jwt = require('jsonwebtoken');
const router = require('express').Router();
const db = require('../../config/db');
const { jwtSecret, jwtExpiresIn } = require('../../config');
const abort = require('../../util/abort');
const User = require('../../model/user');

/*
* POST /api/v1/auth
*/
router.post('/', (req, res, next) => {
  const email = req.body.email;
  const password = req.body.password;

  if (!req.body.email || !req.body.password) {
    throw abort(400, 'Missing required parameters "email" or "password"');
  }

  let userFound;
  User.findOneByEmail(db, email)
  .then(
    (user) => {
      userFound = user;
      return User.comparePassword(password, user.password);
    },
    (_) => { throw abort(401, 'Authentication failed. User not found.', `${email} not found`) }
  )
  .then((isMatch) => {
    if (!isMatch) {
      throw abort(401, 'Authentication failed. Email and password not matched.', `${email} wrong password`);
    }
    // generate token if password matched
    const token = jwt.sign(userFound, jwtSecret, {
      expiresIn: jwtExpiresIn,
    });
    return res.status(200).json({
      status: 'success',
      token: `JWT ${token}`,
      message: 'Authentication succeeded',
    });
  })
  .catch(err => next(err));
});

module.exports = router;
