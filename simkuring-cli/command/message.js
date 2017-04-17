const { Command, Action } = require('../command/base');
const CageurClient = require('../client');
const config = require('../config');
const { print } = require('../utils');

class MessageAction extends Action {
  constructor(client, config) {
    super(client, config);
  }

  // For message sent and scheduled, we can't use the get method
  // from super class since it has nested response on disease_group
  go(object, cmd) {
    if (!this.client.isValid()) {
      print.warning('Token or API target not set');
      return process.exit();
    }

    if (object === 'sent') {
      this.url = '/message/sent';
      this.client.get(this.url).then(
        (res) => {
          return print.table(res.data.map(d => {
            d.disease_group = d.disease_group.name;
            return d;
          }));
        },
        (err) => print.danger(err)
      );
    }

    if (object === 'scheduled') {
      this.url = '/message/schedule';
      this.client.get(this.url).then(
        (res) => {
          return print.table(res.data.map(d => {
            d.disease_group = d.disease_group.name;
            return d;
          }));
        },
        (err) => print.danger(err)
      );
    }
  }
}

class MessageCommand {
  static factory(Program, Action) {
    const client = new CageurClient({
      targetUrl: config.url,
      token: config.token,
    });
    
    const action = new Action(client, config);

    const cmd = new Command(Program, {
      object: 'message <object> <cmd>',
      description: 'Message information from clients',
      action: (object, cmd) => action.go(object, cmd),
    });
    return cmd.execute();
  }
}

module.exports = { MessageAction, MessageCommand };