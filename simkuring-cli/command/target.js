const { Command, Action } = require('../command/base');
const CageurClient = require('../client');
const config = require('../config');
const { print } = require('../utils');

class TargetAction extends Action {
  constructor(client, config) {
    super(client, config);
  }

  go(cmd, param, option) {
    if (cmd === 'set') {
      const url = param;
      this.config.url = url;
      print.success('Target url has been set');
    }

    if (cmd === 'show') {
      print.default(this.config);
    }

    if (cmd === 'login') {
      this.login(option.email, option.password);
      
    }

    if (cmd === 'clear') {
      this.config.url = '';
      this.config.token = '';
      print.success('Target has been cleared out');
    }
  }

  login(email, password) {
    if (!email || !password) {
        print.warning('Please specify user and password');
        return process.exit();
      }
      if (!this.config.url) {
        print.warning('Please set target API url');
        return process.exit();
      }
      this.client.post('/auth', { email, password })
      .then(
        (res) => { 
          this.config.token = res.token; 
          this.client.headers['Authorization'] = res.token;
          return this.isAdmin();       
        }, 
        (err) => print.danger(err)
      )
      .then(admin => {
        if (!admin) {
          print.danger('Only admin can use simkuring CLI');
          this.config.token = '';
          this.client.headers['Authorization'] = '';
          return process.exit();
        }
        print.success('Login successful, token is stored');
        print.default(this.config.token);   
      });
  }

  isAdmin() {
    return new Promise((resolve, reject) => {
      this.client.get('/profile').then(
        d => resolve(d.data.role === 'superadmin'),
        e => reject(print.danger(e)));
    });
  }
}

class TargetCommand {
  static factory(Program, Action) {
    const client = new CageurClient({
      targetUrl: config.url,
      token: config.token,
    });
    
    const action = new Action(client, config);

    const cmd = new Command(Program, {
      object: 'target <cmd> [param]',
      description: 'Set API target endpoint',
      action: (cmd, param, option) => action.go(cmd, param, option),
    });
    cmd.addOption('-u, --email <email>', 'The user email to authenticate as');
    cmd.addOption('-p, --password <password>', 'The user\'s password');
    return cmd.execute();
  }
}

module.exports = { TargetAction, TargetCommand };