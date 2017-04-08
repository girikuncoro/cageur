var constant    = require('../constant');
var auth        = require('../lib/auth');
var fetch       = require('node-fetch');
var chalk       = require('chalk');

module.exports = {
  insertPatient: function(data) {
    var API_URL = constant.API_URL;
    var token = auth.getToken();
    var API_HEADERS = {
      'Content-Type': 'application/json',
      'Authorization': token
    }

    data.map(function(d, i) {
      var body = d;

      fetch(API_URL+'/patient', {
        method: 'POST',
        headers: API_HEADERS,
        body: JSON.stringify(body)
      })
      .then((response) => {
        if (response.ok) {
          return response.json()
        } else {
          response.text().then((error) =>{
            console.log(chalk.red('status: error => row: ', i+1 , ' ', JSON.parse(error).message));
          })
        }
      })
      .then((responseData) => {
        if (responseData) {
          console.log('status: ', responseData.status, ', data: ', JSON.stringify(responseData.data));
        }
      })
      .catch((error) => {
        console.log('Error fetching and parsing data', error);
      })
    })
  }
}
