/**
* Module dependencies
*/
const express = require('express');

const app = express();
const bodyParser = require('body-parser');
const cors = require('cors');

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

/**
* API routes
*/
app.use('/', require('./app/api/test'));
app.use('/api/v1/template', require('./app/api/template'));
app.use('/api/v1/message/send', require('./app/api/message/send'));

/**
 * Error handler routes.
 */
app.use((err, _, res, __) => {
  res.status(err.status || 500)
  .json({
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
