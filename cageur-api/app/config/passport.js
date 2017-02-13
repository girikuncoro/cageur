const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;
const { jwtSecret } = require('../config');
const db = require('../config/db');
const User = require('../model/user');

module.exports = (passport) => {
  const params = {
    secretOrKey: jwtSecret,
    jwtFromRequest: ExtractJwt.fromAuthHeader(),
  };

  passport.use(new JwtStrategy(params, (payload, done) => {
    User.findOneByID(db, payload.id)
    .then(
      (user) => done(null, user),
      (err) => done(err, false)
    )
  }));
};