const { Command, Action } = require('../command/base');
const CageurClient = require('../client');
const config = require('../config');
const { print, file } = require('../utils');

class PatientAction extends Action {
  constructor(client, config) {
    super(client, config, { url: '/patient' });
  }

  go(cmd, option) {
    if (cmd === 'get') {
      super.get();
    }
    if (cmd === 'import') {
      if (!option.inputfile) {
        print.warning('Please specify csv/xlsx file for import and make sure it exists');
        return process.exit();
      }
      super.import(option.inputfile);
    }
  }
}

class PatientCommand {
  static factory(Program, Action) {
    const client = new CageurClient({
      targetUrl: config.url,
      token: config.token,
    });
    
    const action = new Action(client, config);

    const cmd = new Command(Program, {
      object: 'patient <cmd>',
      description: 'Patient information in registered clinics',
      action: (cmd, option) => action.go(cmd, option),
    });
    cmd.addOption('-f, --inputfile <inputfile>', 'CSV/XLSX file to import and bulk insert patient info');
    return cmd.execute();
  }
}

module.exports = { PatientAction, PatientCommand };