const abort = require('../util/abort');

module.exports = {
  authenticate(passport) {
    return passport.authenticate('jwt', { session: false });
  },

  isAuthorized: {
    clinic(req, res, next) {
      console.log('auth clinic: ', JSON.stringify(req.user));
      if (req.user.role === 'clinic') {
        return next();
      }
      return next(abort(401, 'Must have clinic level permission', JSON.stringify(req.user)));
    },
    superAdmin(req, res, next) {
      if (req.user.role === 'superadmin') {
        return next();
      }
      return next(abort(401, 'Must have superadmin level permission', JSON.stringify(req.user)));
    },
  },
};
