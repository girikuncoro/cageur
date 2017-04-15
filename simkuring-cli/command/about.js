const { Command, Action } = require('../command/base');
const figlet = require('figlet');
const { print } = require('../utils');

class AboutAction extends Action {
  constructor() {
    super();
  }

  go() {
    print.warning(figlet.textSync('Simkuring', { horizontalLayout: 'full' }));
  }
}

class AboutCommand {
  static factory(Program, Action) {
    const action = new Action();

    const cmd = new Command(Program, {
      object: 'about',
      description: 'General simkuring CLI information',
      action: () => action.go(),
    });

    return cmd.execute();
  }
}

module.exports = { AboutAction, AboutCommand };