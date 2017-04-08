#!/usr/bin/env node

"use strict";

var chalk       = require('chalk');
var clear       = require('clear');
var figlet      = require('figlet');
var program     = require('commander');
var files       = require('./lib/files');
var auth        = require('./lib/auth');
var patient     = require('./commands/patient');

clear();
console.log(
  chalk.yellow(
    figlet.textSync('Simkuring', { horizontalLayout: 'full' })
  )
);

program
  .arguments('<file>')
  .parse(process.argv);

if(!program.args.length) {
    program.help();
} else {
  var fileName = program.args[0];

  // Authenticating ....
  auth.cageurAuth(function(err, authed) {

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
      if (files.fileExists(fileName)) {
        var data = files.readFile(fileName);
        patient.insertPatient(data);
      } else {
        process.exit(0);
      }
    }
  });
}
