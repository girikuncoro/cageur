const { Command, Action } = require('../command/base');
const CageurClient = require('../client');
const config = require('../config');
const { print, file } = require('../utils');

class PatientDiseaseGroupAction extends Action {
  constructor(client, config) {
    super(client, config, { url: '/patient_disease_group' });
  }

  // Because of weird json output of patient disease group API,
  // print table doesn't work out in base class, so we have to tweak
  go(cmd, option) {
    this.validate();
    if (cmd === 'get') {
      this.client.get(this.url).then(
        (res) => {     
          return print.table(res.data.map(d => {
            const res = d.patient_disease_group;
            res.patient = JSON.stringify(res.patient);
            res.disease_group = JSON.stringify(res.disease_group);
            return res;
          }));
        },
        (err) => print.danger(err)
      );
    }
    if (cmd === 'import') {
      if (!option.inputfile) {
        print.warning('Please specify csv/xlsx file for import and make sure it exists');
        return process.exit();
      }
      super.import(option.inputfile);
    }
  }
}

class PatientDiseaseGroupCommand {
  static factory(Program, Action) {
    const client = new CageurClient({
      targetUrl: config.url,
      token: config.token,
    });
    
    const action = new Action(client, config);

    const cmd = new Command(Program, {
      object: 'patient-disease <cmd>',
      description: 'Patient with disease group information',
      action: (cmd, option) => action.go(cmd, option),
    });
    cmd.addOption('-f, --inputfile <inputfile>', 'CSV/XLSX file to import and bulk insert patient disease group info');
    return cmd.execute();
  }
}

module.exports = { PatientDiseaseGroupAction, PatientDiseaseGroupCommand };