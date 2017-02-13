/**
* Module dependencies
*/
const express = require('express');

const app = express();
const bodyParser = require('body-parser');
const cors = require('cors');

const debug = require('debug')('cageur');
const morgan = require('morgan');

// jst config
var jwt = require("jwt-simple");
var auth = require("./auth.js")();
var cfg = require("./config.js");

// still using static data
var users = require("./app/api/users/login.js");

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

// initialize jwt auth method
app.use(auth.initialize());

/**
* API routes
* how to make restricted pages
* app.get("/url", auth.authenticate(), function(x, y)
*/

app.use('/', require('./app/api'));

app.use('/api/v1/clinic', require('./app/api/clinic'));
app.use('/api/v1/disease_group', require('./app/api/disease-group'));
app.use('/api/v1/patient', require('./app/api/patient'));
app.use('/api/v1/patient_disease_group', require('./app/api/patient-disease-group'));
app.use('/api/v1/bank', require('./app/api/bank'));
app.use('/api/v1/subscription', require('./app/api/subscription'));
app.use('/api/v1/user', require('./app/api/user'));

app.use('/api/v1/template', require('./app/api/template'));
app.use('/api/v1/message/send', require('./app/api/message/send'));
app.use('/api/v1/message/sent', require('./app/api/message/sent'));
app.use('/api/v1/message/schedule', require('./app/api/message/schedule'));
app.use('/api/v1/message/incoming', require('./app/api/message/incoming'));
app.use('/api/v1/analytics/message', require('./app/api/analytics/message'));


/**
* API TOKEN JWT
* generate token with your user credential that taken from db
* if the condition match, it should return JWT code.
* you need to use it everytime you want to access the restricted pages.
*
* HOW TO PASS JWT CODE
*
* in headers, you need to pass this
* Authorization : JWT token
* Example :
* Authorization : JWT eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpZCI6MX0.N0D7YmoU7HJQ9MSQ15QmSLhbPhCplNfaI8haFBfmu2s
*
*/

app.post("/api/v1/token", function(req, res) {
    if (req.body.email && req.body.password) {
        let email = req.body.email;
        let password = req.body.password;
        // let user = users.find(function(u) {
        //     return u.email === email && u.password === password;
        // });
        // if (user) {
        //     let payload = {
        //         id: user.id
        //     };
        //     let token = jwt.encode(payload, cfg.jwtSecret);
        //     res.json({
        //         id: user.id,
        //         token: token,
        //         status:'success'
        //     });
        // } else {
        //     res.sendStatus(401);
        // }
        users.getAllUser().then(data => {
            let found = data.find(user => user.email === email && user.password === password);

            console.log(data, found);

            if (found) {
                let payload = {
                    id: found.id
                };
                let token = jwt.encode(payload, cfg.jwtSecret);
                res.json({
                    id: found.id,
                    token: token,
                    status:'success'
                });
            } else {
                res.sendStatus(401);
            }
        })
    } else {
        res.sendStatus(401);
    }
});


// test restricted page
app.get("/api/v1/restricted", auth.authenticate(), function(req, res) {
    const authorization = req.get('authorization');
    const token = authorization.split('Bearer ')[1];

    console.log(authorization);
    console.log('======');
    console.log(token);

    res.json('halo');
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
