/**
* Module dependencies
*/
const express = require('express');
const app = express();
const bodyParser = require('body-parser');

const debug = require('debug')('cageur');
const morgan = require('morgan');

app.set('port', (process.env.PORT || 5000));

/**
* Middleware
*/
app.use(morgan('combined'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

/**
* API routes
*/
app.use('/', require('./app/api/test'));
app.use('/api/v1/message/send', require('./app/api/message/send'));

/**
 * Error handler routes.
 */
app.use((err, req, res, next) => {
  res.status(err.status || 500)
  .json({
    status: 'error',
    message: err.message,
  });
});

/**
 * Nodejs server listens forever
 */
app.listen(app.get('port'), () => {
  debug('Node app is running on port', app.get('port'));
});

module.exports = app;
