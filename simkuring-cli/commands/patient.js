var constant    = require('../constant');
var auth        = require('../lib/auth');
var fetch       = require('node-fetch');

module.exports = {
  insertPatient: function(data) {
    var API_URL = constant.API_URL;
    var token = auth.prefs.cageur.token;
    var API_HEADERS = {
      'Content-Type': 'application/json',
      'Authorization': token
    }
    var body = data[0];

    fetch(API_URL+'/patient', {
      method: 'POST',
      headers: API_HEADERS,
      body: JSON.stringify(body)
    })
    .then((response) => {
      console.log(response);
    })
    .catch((error) => {
      console.log('Error fetching and parsing data', error);
    })
  }
}
