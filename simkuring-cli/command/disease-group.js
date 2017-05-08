const { Command, Action } = require('../command/base');
const CageurClient = require('../client');
const config = require('../config');
const { print, file } = require('../utils');
const prompt = require('prompt');

class DiseaseGroupAction extends Action {
  constructor(client, config) {
    super(client, config, { url: '/disease_group' });
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
          name: {
            required: true,
            type: 'string',
            description: 'Type new disease group name',
            message: 'disease group name must exist'
          }
        }
      }

      prompt.start();
      prompt.get(schema, (err, data) => {
        super.create(data);
      });
    }
    if (cmd === 'delete') {
      if (!option.id) {
        print.warning('Please specify id to delete');
        return process.exit();
      }
      super.delete(option.id);
    }
  }
}

class DiseaseGroupCommand {
  static factory(Program, Action) {
    const client = new CageurClient({
      targetUrl: config.url,
      token: config.token,
    });
    
    const action = new Action(client, config);

    const cmd = new Command(Program, {
      object: 'disease-group <cmd>',
      description: 'Disease group information',
      action: (cmd, option) => action.go(cmd, option),
    });
    cmd.addOption('-f, --inputfile <inputfile>', 'CSV/XLSX file to import and bulk insert patient info');
    cmd.addOption('-i, --id <id>', 'id for entry');
    return cmd.execute();
  }
}

module.exports = { DiseaseGroupAction, DiseaseGroupCommand };