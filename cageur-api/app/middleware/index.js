const abort = require('../util/abort');

module.exports = {
  authenticate(passport) {
    return passport.authenticate('jwt', { session: false });
  },

  isAuthorized: {
    // any clinic can access
    clinicAny(req, res, next) {
      // superadmin permission can do anything
      if (req.user.role === 'superadmin') {
        return next();
      }
      if (req.user.role === 'clinic') {
        return next();
      }
      return next(abort(401, 'Insufficient permission', JSON.stringify(req.user)));
    },

    // clinic can only access its own data
    clinicSelf(req, res, next) {
      const clinicID = parseInt(req.params['clinic_id'], 10);

      // superadmin permission can do anything
      if (req.user.role === 'superadmin') {
        return next();
      }
      if (req.user.role === 'clinic') {
        if (req.user['clinic_id'] !== clinicID) {
          return next(abort(401, 'Insufficient permission', JSON.stringify(req.user)));
        }
        return next();
      }
      return next(abort(401, 'Insufficient permission', JSON.stringify(req.user)));
    },

    superAdmin(req, res, next) {
      if (req.user.role === 'superadmin') {
        return next();
      }
      return next(abort(401, 'Insufficient permission', JSON.stringify(req.user)));
    },
  },

  forceSsl(req, res, next) {
    if (req.headers['x-forwarded-proto' !== 'https']) {
      return res.redirect(['https://', req.get('Host'), req.url].join(''));
    }
    return next;
  },
};
