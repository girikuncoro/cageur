const { Command, Action } = require('../command/base');
const CageurClient = require('../client');
const config = require('../config');
const { print } = require('../utils');

class PatientDiseaseGroupAction extends Action {
  constructor(client, config) {
    super(client, config, { url: '/patient_disease_group' });
  }

  // Because of weird json output of patient disease group API,
  // print table doesn't work out in base class, so we have to tweak
  go(cmd) {
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
      action: (cmd) => action.go(cmd),
    });

    return cmd.execute();
  }
}

module.exports = { PatientDiseaseGroupAction, PatientDiseaseGroupCommand };