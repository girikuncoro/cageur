const { Command, Action } = require('../command/base');
const CageurClient = require('../client');
const config = require('../config');
const { print } = require('../utils');

class UserAction extends Action {
  constructor(client, config) {
    super(client, config, { url: '/user' });
  }

  go(cmd) {
    if (!this.client.isValid()) {
      print.warning('Token or API target not set');
      return process.exit();
    }
    if (cmd === 'get') {
      super.get();
    }
  }
}

class UserCommand {
  static factory(Program, Action) {
    const client = new CageurClient({
      targetUrl: config.url,
      token: config.token,
    });
    
    const action = new Action(client, config);

    const cmd = new Command(Program, {
      object: 'user <cmd>',
      description: 'User accounts that could access Cageur system',
      action: (cmd) => action.go(cmd),
    });

    return cmd.execute();
  }
}

module.exports = { UserAction, UserCommand };