/**
* Module dependencies
*/
const express = require('express');

const app = express();
const bodyParser = require('body-parser');
const cors = require('cors');
const passport = require('passport');
const passportStrategy = require('./app/config/passport');
const helmet = require('helmet');

const debug = require('debug')('cageur');
const morgan = require('morgan');

const { port } = require('./app/config');
const { authenticate, isAuthorized } = require('./app/middleware');

/**
* Middleware
*/
app.use(helmet());
if (process.env.NODE_ENV !== 'test') {
  app.use(morgan('combined'));
}
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json({
  verify(req, res, buf) {
    req.rawBody = buf;  // line signature validator need buffer
  }
}));
app.use(cors()); // TODO: whitelist the origin for production

// Init passport use
app.use(passport.initialize());
passportStrategy(passport);

/**
* API routes
*/
app.use('/', require('./app/api'));
app.use('/api/v1/restricted/clinic', authenticate(passport), isAuthorized.clinicAny, require('./app/api/restricted'));
app.use('/api/v1/restricted/superadmin', authenticate(passport), isAuthorized.superAdmin, require('./app/api/restricted'));

// TODO: each GET, POST, PUT, DELETE should have separate auth group/role
app.use('/api/v1/clinic', authenticate(passport), require('./app/api/clinic'));
app.use('/api/v1/disease_group', authenticate(passport), require('./app/api/disease-group'));
app.use('/api/v1/patient', authenticate(passport), require('./app/api/patient'));
app.use('/api/v1/patient_disease_group', authenticate(passport), require('./app/api/patient-disease-group'));

app.use('/api/v1/bank', authenticate(passport), require('./app/api/bank'));
app.use('/api/v1/subscription', authenticate(passport), require('./app/api/subscription'));
app.use('/api/v1/user', authenticate(passport), require('./app/api/user'));
app.use('/api/v1/profile', authenticate(passport), require('./app/api/profile'));
app.use('/api/v1/auth', require('./app/api/auth'));

app.use('/api/v1/template', authenticate(passport), require('./app/api/template'));
app.use('/api/v1/message/send', authenticate(passport), require('./app/api/message/send'));
app.use('/api/v1/message/sent', authenticate(passport), require('./app/api/message/sent'));
app.use('/api/v1/message/schedule', authenticate(passport), require('./app/api/message/schedule'));
app.use('/api/v1/message/incoming', require('./app/api/message/incoming'));  // auth using user validator
app.use('/api/v1/analytics/message', authenticate(passport), require('./app/api/analytics/message'));

/**
 * Error handler routes.
 */
app.use((err, _, res, __) => {
  res.status(err.status || 500).json({
    status: 'error',
    message: err.message,
  });
});

/**
 * Nodejs server listens forever
 */
app.listen(port, () => {
  const stage = process.env.NODE_ENV === 'test' ? 'test' : 'dev';
  debug(`Node ${stage} server is running on port`, port);
});

module.exports = app;
