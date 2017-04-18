const { Command, Action } = require('../command/base');
const CageurClient = require('../client');
const config = require('../config');
const { print, generatePassword } = require('../utils');
const prompt = require('prompt');

const EMAIL_REGEX = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

class UserAction extends Action {
  constructor(client, config) {
    super(client, config, { url: '/user' });
    this.userCreate = {
      properties: {
        email: {
          pattern: EMAIL_REGEX,
          message: 'Email must be in proper format',
          required: true,
        },
      }
    };
  }

  go(cmd) {
    if (cmd === 'get') {
      super.get();
    }
    if (cmd === 'create') {
      prompt.start();
      prompt.get(this.userCreate, (err, res) => {
        // Should only create user for clinic, creating superadmin is dangerous
        this.client.post('/user', {
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
      });
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