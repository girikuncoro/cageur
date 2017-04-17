#! /usr/bin/env node
const Program = require('commander');
const { AboutCommand, AboutAction } = require('./command/about');
const { BankCommand, BankAction } = require('./command/bank');
const { ClinicCommand, ClinicAction } = require('./command/clinic');
const { DiseaseGroupCommand, DiseaseGroupAction } = require('./command/disease-group');
const { MessageCommand, MessageAction } = require('./command/message');
const { PatientCommand, PatientAction } = require('./command/patient');
const { PatientDiseaseGroupCommand, PatientDiseaseGroupAction } = require('./command/patient-disease-group');
const { SubscriptionCommand, SubscriptionAction } = require('./command/subscription');
const { TargetCommand, TargetAction } = require('./command/target');
const { TemplateCommand, TemplateAction } = require('./command/template');
const { UserCommand, UserAction } = require('./command/user');

const Spinner = require('clui').Spinner;
const loading = new Spinner('Loading Simkuring CLI action ...');
loading.start();

// List of command factory
AboutCommand.factory(Program, AboutAction);
BankCommand.factory(Program, BankAction);
ClinicCommand.factory(Program, ClinicAction);
DiseaseGroupCommand.factory(Program, DiseaseGroupAction);
MessageCommand.factory(Program, MessageAction);
PatientCommand.factory(Program, PatientAction);
PatientDiseaseGroupCommand.factory(Program, PatientDiseaseGroupAction);
SubscriptionCommand.factory(Program, SubscriptionAction);
TargetCommand.factory(Program, TargetAction);
TemplateCommand.factory(Program, TemplateAction);
UserCommand.factory(Program, UserAction);

// TODO: display help if all commands are passed

Program.parse(process.argv);
loading.stop();
