const { Command, Action } = require('../command/base');
const CageurClient = require('../client');
const config = require('../config');
const { print } = require('../utils');

class DiseaseGroupAction extends Action {
  constructor(client, config) {
    super(client, config, { url: '/disease_group' });
  }

  go(cmd) {
    if (cmd === 'get') {
      super.get();
    }
  }
}

class DiseaseGroupCommand {
  static factory(Program, Action) {
    const client = new CageurClient({
      targetUrl: config.url,
      token: config.token,
    });
    
    const action = new Action(client, config);

    const cmd = new Command(Program, {
      object: 'disease-group <cmd>',
      description: 'Disease group information',
      action: (cmd) => action.go(cmd),
    });

    return cmd.execute();
  }
}

module.exports = { DiseaseGroupAction, DiseaseGroupCommand };