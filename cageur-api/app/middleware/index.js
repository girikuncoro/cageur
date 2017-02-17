const abort = require('../util/abort');

const extractClinicID = (req) => {
  // example: /api/v1/message/schedule/clinic/1
  const originalUrl = req.originalUrl;
  // example: /api/v1/message/schedule
  const baseUrl = req.baseUrl;
  const params = originalUrl.split(baseUrl)[1];

  if (params.indexOf('/clinic/') > -1) {
    const clinicID = params.split('/clinic/')[1];
    return parseInt(clinicID, 10);
  }
  return null;
};

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
      const clinicID = parseInt(req.params.id, 10);

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
};
