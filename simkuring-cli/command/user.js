const { Command, Action } = require('../command/base');
const CageurClient = require('../client');
const config = require('../config');
const { print, generatePassword } = require('../utils');
const prompt = require('prompt');

const EMAIL_REGEX = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

class UserAction extends Action {
  constructor(client, config) {
    super(client, config, { url: '/user' });
    this.userPrompt = {
      properties: {
        name: {
          pattern: /^[\w\-\s]+$/,
          message: 'Name of clinic user is required',
          required: true,
        },
        email: {
          pattern: EMAIL_REGEX,
          message: 'Email must be in proper format',
          required: true,
        },
        clinicID: {
          pattern: /^\d+$/,
          message: 'Must be valid clinic id',
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
      this.createUser();
    };
  }

  createUser() {
    prompt.start();
    prompt.get(this.userPrompt, (err, res) => {
      let randomPassword;
      super.confirm(res).then(data => {
        randomPassword = generatePassword();
        return this.client.post('/user', {
          name: data.name,
          email: data.email,
          password: randomPassword,
          role: 'clinic',
          clinic_id: data.clinicID,
        })
      })
      .then(
        (res) => {
          print.success('User has been created');
          print.default(res);
          print.warning(`password: ${randomPassword} (treat carefully)`);
        },
        (err) => print.danger(err)
      )
    });
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