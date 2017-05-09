const fetch = require('node-fetch');
const { print } = require('../utils');
const ora = require('ora');

class CageurClient {
  constructor(options={}) {
    this.targetUrl = options.targetUrl || 'http://localhost:5000';
    this.baseUrl = this.targetUrl + '/api/v1';
    this.token = options.token || '';
    this.headers = {
      'Content-Type': 'application/json',
      'Authorization': this.token,
    };
  }

  isValid() {
    return this.token != '' && this.targetUrl != '' && 
      (this.targetUrl.indexOf("http://") == 0 || this.targetUrl.indexOf("https://") == 0);
  }

  get(endpoint) {
    return new Promise((resolve, reject) => {
      const url = this.baseUrl + endpoint;
      fetch(url, {
        method: 'GET',
        headers: this.headers,
      })
      .then(
        (res) => {
          if (res.ok) {
            return resolve(res.json());
          }
          res.text().then((err) => {
            return reject(err);
          });
        },
        (err) => reject(err)
      );
    });
  }

  post(endpoint, data) {
    return new Promise((resolve, reject) => {
      const spinner = ora('Importing data...').start();    
      const url = this.baseUrl + endpoint;
      fetch(url, {
        method: 'POST',
        headers: this.headers,
        body: JSON.stringify(data),
      })
      .then(
        (res) => {
          if (res.ok) {
            spinner.succeed('ok');
            return resolve(res.json());
          }
          res.text().then((err) => {
            spinner.fail(JSON.parse(err).status + ' : ' + JSON.parse(err).message);
            return reject(err);
          });
        },
        (err) => reject(err)
      );
    });
  }

  delete(endpoint, id) {
    return new Promise((resolve, reject) => {
      const url = this.baseUrl + endpoint + '/' + id;
      fetch(url, {
        method: 'DELETE',
        headers: this.headers,
      })
      .then(
        (res) => {
          if (res.ok) {
            return resolve(res.json());
          }
          res.text().then((err) => {
            return reject(err);
          });
        },
        (err) => reject(err)
      );
    });
  }
}

module.exports = CageurClient;