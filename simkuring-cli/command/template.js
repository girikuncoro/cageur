const { Command, Action } = require('../command/base');
const CageurClient = require('../client');
const config = require('../config');
const { print, file } = require('../utils');
const prompt = require('prompt');

class TemplateAction extends Action {
  constructor(client, config) {
    super(client, config, { url: '/template' });
  }

  go(cmd, option) {
    if (cmd === 'get') {
      super.get();
    }
    if (cmd === 'import') {
      if (!option.inputfile) {
        print.warning('Please specify csv/xlsx file for import and make sure it exists');
        return process.exit();
      }
      super.import(option.inputfile);
    }
    if (cmd === 'create') {
      const schema = {
        properties: {
          disease_group: {
            required: true,
            type: 'number',
            description: 'Type disease group id',
            message: 'disease group must be number'
          },
          title: {
            required: true,
            type: 'string',
            description: 'Type template title',
            message: 'title must exist'
          },
          content: {
            required: true,
            type: 'string',
            description: 'Type template content',
            message: 'content must exist'
          } 
        }
      }

      prompt.start();
      prompt.get(schema, (err, data) => {
        super.create(data);
      });
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
      action: (cmd, option) => action.go(cmd, option),
    });
    cmd.addOption('-f, --inputfile <inputfile>', 'CSV/XLSX file to import and bulk insert patient info');
    return cmd.execute();
  }
}

module.exports = { TemplateAction, TemplateCommand };