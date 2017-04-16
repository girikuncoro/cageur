const { Command, Action } = require('../command/base');
const CageurClient = require('../client');
const config = require('../config');
const { print } = require('../utils');

class TargetAction extends Action {
  constructor(client, config) {
    super(client, config);
  }

  go(cmd, param, option) {
    if (cmd === 'set') {
      const url = param;
      this.config.url = url;
    }

    if (cmd === 'show') {
      print.default(config);
    }

    if (cmd === 'login') {
      if (!option.email || !option.password) {
        print.warning('Please specify user and password');
        return process.exit();
      }
      if (!this.config.url) {
        print.warning('Please set target API url');
        return process.exit();
      }
      this.client.post('/auth', {
        email: option.email,
        password: option.password,
      })
      .then(
        (res) => { 
          this.config.token = res.token; 
          print.success('Login successful, token is stored');
          print.default(res.token);          
        }, 
        (err) => print.danger(err)
      );
    }
  }
}

class TargetCommand {
  static factory(Program, Action) {
    const client = new CageurClient({
      targetUrl: config.url,
      token: config.token,
    });
    
    const action = new Action(client, config);

    const cmd = new Command(Program, {
      object: 'target <cmd> [param]',
      description: 'Set API target endpoint',
      action: (cmd, param, option) => action.go(cmd, param, option),
    });
    cmd.addOption('-u, --email <email>', 'The user email to authenticate as');
    cmd.addOption('-p, --password <password>', 'The user\'s password');
    return cmd.execute();
  }
}

module.exports = { TargetAction, TargetCommand };