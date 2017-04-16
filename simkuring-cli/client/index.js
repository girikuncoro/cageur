const fetch = require('node-fetch');

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
      const url = this.baseUrl + endpoint;
      fetch(url, {
        method: 'POST',
        headers: this.headers,
        body: JSON.stringify(data),
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