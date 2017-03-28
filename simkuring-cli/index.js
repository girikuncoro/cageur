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
        callback();
      });
    })
    .parse(process.argv);
}

function getCageurToken(callback) {
  var prefs = new Preferences('cageur');

  if (prefs.cageur && prefs.cageur.token) {
    return callback(null, prefs.cageur.token);
  }

  getCageurCredentials(function(credentials) {
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
            console.log(chalk.bold.cyan(res.text));
            status.stop();
            process.exit(0);
          }

          var errorMessage;
          if (res && res.status === 401) {
            errorMessage = "Authentication failed! Bad email/password?";
          } else if (err) {
            errorMessage = err;
          } else {
            errorMessage = res.text;
          }
          console.error(chalk.red(errorMessage));
          process.exit(1);
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
    switch (err.code) {
      case 401:
        console.log(chalk.red('Couldn\'t log you in. Please try again.'));
        break;
      case 422:
        console.log(chalk.red('You already have an access token.'));
        break;
    }
  }
  if (authed) {
    console.log(chalk.green('Sucessfully authenticated!'));

    // next step is below
  }
});
