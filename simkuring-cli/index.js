#! /usr/bin/env node
const Program = require('commander');
const { AboutCommand, AboutAction } = require('./command/about');
const { ClinicCommand, ClinicAction } = require('./command/clinic');
const { PatientCommand, PatientAction } = require('./command/patient');
const { TargetCommand, TargetAction } = require('./command/target');
const { TemplateCommand, TemplateAction } = require('./command/template');

const Spinner = require('clui').Spinner;
const loading = new Spinner('Loading Simkuring CLI action ...');
loading.start();

// List of command factory
AboutCommand.factory(Program, AboutAction);
ClinicCommand.factory(Program, ClinicAction);
PatientCommand.factory(Program, PatientAction);
TargetCommand.factory(Program, TargetAction);
TemplateCommand.factory(Program, TemplateAction);

Program.parse(process.argv);
loading.stop();
