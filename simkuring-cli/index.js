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

clear();
console.log(
  chalk.yellow(
    figlet.textSync('Simkuring', { horizontalLayout: 'full' })
  )
);

program
  .arguments('<file>')
  .option('-u, --username <username>', 'The user to authenticate as')
  .option('-p, --password <password>', 'The user\'s password')
  .action(function(file) {
    co(function *() {
      var email = yield prompt('email: ');
      var password = yield prompt.password('password: ');
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
      });
  })
  .parse(process.argv);
