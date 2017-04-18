const { Command, Action } = require('../command/base');
const CageurClient = require('../client');
const config = require('../config');
const { print, generatePassword } = require('../utils');
const prompt = require('prompt');

const NAME_REGEX = /^[A-Z][a-z0-9_-]{3,19}$/;
const EMAIL_REGEX = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

class UserAction extends Action {
  constructor(client, config) {
    super(client, config, { url: '/user' });
    this.userCreate = {
      properties: {
        name: {
          pattern: NAME_REGEX,
          message: 'Name of clinic user is required, first letter must be uppercase',
          required: true,
        },
        email: {
          pattern: EMAIL_REGEX,
          message: 'Email must be in proper format',
          required: true,
        },
      }
    };
  }

  go(cmd) {
    this.validate();
    if (cmd === 'get') {
      super.get();
    }
    if (cmd === 'create') {
      prompt.start();
      prompt.get(this.userCreate, (err, res) => {
        // Should only create user for clinic, creating superadmin is dangerous
        const randomPassword = generatePassword();
        this.client.post('/user', {
          name: res.name,
          email: res.email,
          password: randomPassword,
          role: 'clinic',
          clinic_id: null, // TODO: should register clinic info first
        })
        .then(
          (res) => { 
            print.success('User has been created');
            print.default(res);
            print.warning(`password: ${randomPassword} (treat carefully)`);
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