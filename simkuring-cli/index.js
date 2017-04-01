#!/usr/bin/env node

"use strict";

var chalk       = require('chalk');
var clear       = require('clear');
var figlet      = require('figlet');
var program     = require('commander');
var co          = require('co');
var prompt      = require('co-prompt');
var files       = require('./lib/files');
var request     = require('superagent');
var CLI         = require('clui');
var Spinner     = CLI.Spinner;
var Preferences = require('preferences');

clear();
console.log(
  chalk.yellow(
    figlet.textSync('Simkuring', { horizontalLayout: 'full' })
  )
);

function getCageurCredentials(callback) {
  program
    .arguments('<file>')
    .option('-u, --email <email>', 'The user email to authenticate as')
    .option('-p, --password <password>', 'The user\'s password')
    .action(function(file) {
      co(function *() {
        var email = yield prompt('email: ');
        var password = yield prompt.password('password: ');
        callback(email, password);
      });
    })
    .parse(process.argv);
}

function getCageurToken(callback) {
  var prefs = new Preferences('cageur');

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
            console.log(token);
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

function cageurAuth(callback) {
  getCageurToken(function(err, token) {
    if (err) {
      return callback(err);
    }
    return callback(null, token);
  });
}

cageurAuth(function(err, authed) {

  if (err) {
    switch (err.status) {
      case 401:
        console.log(chalk.red('Couldn\'t log you in. Bad email/password? Please try again.'));
        break;
      case 422:
        console.log(chalk.red('You already have an access token.'));
        break;
    }
  }
  if (authed) {
    console.log(chalk.cyan('Sucessfully authenticated!'));

    // next step is below
  }
});
