/**
* Module dependencies
*/
const express = require('express');

const app = express();
const bodyParser = require('body-parser');
const cors = require('cors');
const debug = require('debug')('cageur');
const morgan = require('morgan');
const jwt = require('jwt-simple');
const auth = require('./auth')();
const cfg = require('./config');
const users = require('./app/api/users/login');
const { port } = require('./app/config');

/**
* Middleware
*/
if (process.env.NODE_ENV !== 'test') {
  app.use(morgan('combined'));
}
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());// TODO: whitelist the origin for production
app.use(auth.initialize());

app.use('/', require('./app/api'));

app.use('/api/v1/clinic',  auth.authenticate(), require('./app/api/clinic'));

app.use('/api/v1/disease_group', auth.authenticate(), require('./app/api/disease-group'));

app.use('/api/v1/patient', auth.authenticate(), require('./app/api/patient'));

app.use('/api/v1/patient_disease_group', auth.authenticate(), require('./app/api/patient-disease-group'));

app.use('/api/v1/bank', auth.authenticate(), require('./app/api/bank'));

app.use('/api/v1/subscription', auth.authenticate(), require('./app/api/subscription'));

app.use('/api/v1/users', auth.authenticate(), require('./app/api/users'));

app.use('/api/v1/template', require('./app/api/template'));

app.use('/api/v1/message/send', require('./app/api/message/send'));

app.use('/api/v1/message/sent', require('./app/api/message/sent'));

app.use('/api/v1/message/incoming', require('./app/api/message/incoming'));


app.post('/api/v1/token', function(req, res) {
    if (req.body.email && req.body.password) {
        const email = req.body.email;
        const password = req.body.password;
        users.getAllUser().then(data => {
            const found = data.find(user => user.email === email && user.password === password);
            if (found) {
                const payload = { id: found.id };
                const token = jwt.encode(payload, cfg.jwtSecret);
                res.json({ id: found.id, token: token, status: 'success' });
            } else { res.sendStatus(401); }
        })
    } else { res.sendStatus(401); }
});

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
