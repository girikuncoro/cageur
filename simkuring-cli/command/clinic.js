const { Command, Action } = require('../command/base');
const CageurClient = require('../client');
const config = require('../config');

class ClinicAction extends Action {
  constructor(client, config) {
    super(client, config, { from: 'clinic', url: '/clinic' });
  }

  go(option) {
    if (!this.client.isValid()) {
      console.log('Token or API target not set');
      process.exit();
    }
    if (option === 'get') {
      super.get();
    }
  }
}

class ClinicCommand {
  static factory(Program, Action) {
    console.log('StoredConfig in Clinic: ', config);

    const client = new CageurClient({
      targetUrl: config.url,
      token: config.token,
    });
    
    const action = new Action(client, config);

    const cmd = new Command(Program, {
      object: 'clinic <option>',
      description: 'foo',
      action: (option) => action.go(option),
    });

    return cmd.execute();
  }
}

module.exports = { ClinicAction, ClinicCommand };