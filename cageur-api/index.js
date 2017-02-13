/**
* Module dependencies
*/
const express = require('express');

const app = express();
const bodyParser = require('body-parser');
const cors = require('cors');
// const passport = require('passport');
// const passportStrategy = require('./app/config/passport');

const debug = require('debug')('cageur');
const morgan = require('morgan');

const { port } = require('./app/config');

/**
* Middleware
*/
if (process.env.NODE_ENV !== 'test') {
  app.use(morgan('combined'));
}
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors()); // TODO: whitelist the origin for production

// Init passport use
// app.use(passport.initialize());
// passportStrategy(passport);

/**
* API routes
*/
app.use('/', require('./app/api'));

app.use('/api/v1/clinic', require('./app/api/clinic'));
app.use('/api/v1/disease_group', require('./app/api/disease-group'));
app.use('/api/v1/patient', require('./app/api/patient'));
app.use('/api/v1/patient_disease_group', require('./app/api/patient-disease-group'));

app.use('/api/v1/bank', require('./app/api/bank'));
app.use('/api/v1/subscription', require('./app/api/subscription'));
app.use('/api/v1/user', require('./app/api/user'));
// app.use('/api/v1/auth', require('./app/api/auth'));

app.use('/api/v1/template', require('./app/api/template'));
app.use('/api/v1/message/send', require('./app/api/message/send'));
app.use('/api/v1/message/sent', require('./app/api/message/sent'));
app.use('/api/v1/message/schedule', require('./app/api/message/schedule'));
app.use('/api/v1/message/incoming', require('./app/api/message/incoming'));
app.use('/api/v1/analytics/message', require('./app/api/analytics/message'));

// test restricted page
// app.get("/api/v1/restricted", passport.authenticate('jwt', { session: false }), function(req, res) {
//   res.send('It worked, user id is : ' + req.user);
// });

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
