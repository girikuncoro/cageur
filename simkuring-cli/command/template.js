const { Command, Action } = require('../command/base');
const CageurClient = require('../client');
const config = require('../config');
const { print } = require('../utils');

class TemplateAction extends Action {
  constructor(client, config) {
    super(client, config, { url: '/template' });
  }

  go(cmd) {
    if (cmd === 'get') {
      super.get();
    }
  }
}

class TemplateCommand {
  static factory(Program, Action) {
    const client = new CageurClient({
      targetUrl: config.url,
      token: config.token,
    });
    
    const action = new Action(client, config);

    const cmd = new Command(Program, {
      object: 'template <cmd>',
      description: 'High quality reminder template from doctors',
      action: (cmd) => action.go(cmd),
    });

    return cmd.execute();
  }
}

module.exports = { TemplateAction, TemplateCommand };