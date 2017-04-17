#! /usr/bin/env node
const Program = require('commander');
const { AboutCommand, AboutAction } = require('./command/about');
const { BankCommand, BankAction } = require('./command/bank');
const { ClinicCommand, ClinicAction } = require('./command/clinic');
const { DiseaseGroupCommand, DiseaseGroupAction } = require('./command/disease-group');
const { PatientCommand, PatientAction } = require('./command/patient');
const { TargetCommand, TargetAction } = require('./command/target');
const { TemplateCommand, TemplateAction } = require('./command/template');

const Spinner = require('clui').Spinner;
const loading = new Spinner('Loading Simkuring CLI action ...');
loading.start();

// List of command factory
AboutCommand.factory(Program, AboutAction);
BankCommand.factory(Program, BankAction);
ClinicCommand.factory(Program, ClinicAction);
DiseaseGroupCommand.factory(Program, DiseaseGroupAction);
PatientCommand.factory(Program, PatientAction);
TargetCommand.factory(Program, TargetAction);
TemplateCommand.factory(Program, TemplateAction);

Program.parse(process.argv);
loading.stop();
