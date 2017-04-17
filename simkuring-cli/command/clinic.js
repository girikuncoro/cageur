const { Command, Action } = require('../command/base');
const CageurClient = require('../client');
const config = require('../config');
const { print } = require('../utils');

class ClinicAction extends Action {
  constructor(client, config) {
    super(client, config, { url: '/clinic' });
  }

  go(cmd) {
    if (cmd === 'get') {
      super.get();
    }
  }
}

class ClinicCommand {
  static factory(Program, Action) {
    const client = new CageurClient({
      targetUrl: config.url,
      token: config.token,
    });
    
    const action = new Action(client, config);

    const cmd = new Command(Program, {
      object: 'clinic <cmd>',
      description: 'Registered clinic information',
      action: (cmd) => action.go(cmd),
    });

    return cmd.execute();
  }
}

module.exports = { ClinicAction, ClinicCommand };