const { Command, Action } = require('../command/base');
const CageurClient = require('../client');
const config = require('../config');
const { print } = require('../utils');

class BankAction extends Action {
  constructor(client, config) {
    super(client, config, { url: '/bank' });
  }

  go(cmd) {
    if (cmd === 'get') {
      super.get();
    }
  }
}

class BankCommand {
  static factory(Program, Action) {
    const client = new CageurClient({
      targetUrl: config.url,
      token: config.token,
    });
    
    const action = new Action(client, config);

    const cmd = new Command(Program, {
      object: 'bank <cmd>',
      description: 'Bank information for Cageur payment',
      action: (cmd) => action.go(cmd),
    });

    return cmd.execute();
  }
}

module.exports = { BankAction, BankCommand };