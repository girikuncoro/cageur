var chalk       = require('chalk');
var program     = require('commander');
var co          = require('co');
var prompt      = require('co-prompt');
var request     = require('superagent');
var CLI         = require('clui');
var Spinner     = CLI.Spinner;
var Preferences = require('preferences');

// Init preference file
var prefs = new Preferences('cageur');

function getCageurCredentials(callback) {
  program
    .option('-u, --email <email>', 'The user email to authenticate as')
    .option('-p, --password <password>', 'The user\'s password')
    .action(function() {
      co(function *() {
        var email = yield prompt('email: ');
        var password = yield prompt.password('password: ');
        callback(email, password);
      });
    })
    .parse(process.argv);
}

function getCageurToken(callback) {

  // Check for token in global prefs file
  if (prefs.cageur && prefs.cageur.token) {
    console.log(chalk.green('Already signed in.'));
    return callback(null, prefs.cageur.token);
  }

  getCageurCredentials(function(email, password) {
    var status = new Spinner('Authenticating you, please wait...');
    status.start();
    request
       .post('http://localhost:5000/api/v1/auth')
       .set('Accept', 'application/json')
       .send({
         "email": email,
         "password": password
       })
       .end(function (err, res) {
          if (!err && res.ok) {
            status.stop();
            var token = JSON.parse(res.text).token;
            prefs.cageur = {
              token : token
            };
            return callback(null, token);
          }

          if (err) {
            status.stop();
            return callback(err);
          }
        });
  })
}

module.exports = {
  cageurAuth: function cageurAuth(callback) {
    getCageurToken(function(err, token) {
      if (err) {
        return callback(err);
      }
      return callback(null, token);
    });
  },
  prefs: prefs
}
