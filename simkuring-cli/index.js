const Program = require('commander');
const { TargetCommand, TargetAction } = require('./command/target');
const { ClinicCommand, ClinicAction } = require('./command/clinic');

// List of command factory
TargetCommand.factory(Program, TargetAction);
ClinicCommand.factory(Program, ClinicAction);

Program.parse(process.argv);