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
    clinic(req, res, next) {
      // superadmin permission can do anything
      if (req.user.role === 'superadmin') {
        return next();
      }
      // for clinic permission, must check if requested its own clinic data
      if (req.user.role === 'clinic') {
        const clinicID = extractClinicID(req);
        if (clinicID && req.user['clinic_id'] !== clinicID) {
          return next(abort(401, 'Must have clinic permission', JSON.stringify(req.user)));
        }
        return next();
      }
      return next(abort(401, 'Must have permission', JSON.stringify(req.user)));
    },

    superAdmin(req, res, next) {
      if (req.user.role === 'superadmin') {
        return next();
      }
      return next(abort(401, 'Must have superadmin level permission', JSON.stringify(req.user)));
    },
  },
};
