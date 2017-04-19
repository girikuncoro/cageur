const { Command, Action } = require('../command/base');
const CageurClient = require('../client');
const config = require('../config');
const { print } = require('../utils');
const prompt = require('prompt');

class ClinicAction extends Action {
  constructor(client, config) {
    super(client, config, { url: '/clinic' });
    this.clinicPrompt = {
      properties: {
        name: {
          pattern: /^[\w\-\s]+$/,
          message: 'Invalid name of clinic',
          required: true,
        },
        address: {
          pattern: /(.*?)/,
          message: 'Invalid street address',
          required: true,
        },
        phoneNumber: {
          pattern: /^[0-9]{4,}$/,
          message: 'Invalid phone number',
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
      this.createClinic();
    }
  }

  createClinic() {
    prompt.start();
    prompt.get(this.clinicPrompt, (err, res) => {
      super.confirm(res).then(data => {
        return this.client.post('/clinic', {
          name: data.name,
          address: data.address,
          phone_number: data.phoneNumber,
        })
      })
      .then(
        (res) => {
          print.success('Clinic has been created');
          print.default(res);
        },
        (err) => print.danger(err)
      )
    });
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