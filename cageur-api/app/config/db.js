const promise = require('bluebird');
const pgp = require('pg-promise')({ promiseLib: promise });

let postgresUrl = require('../config').postgresUrl;
if (process.env.NODE_ENV === 'seed-admin') {
  postgresUrl += '?ssl=true';  
}

const db = pgp(postgresUrl);

module.exports = db;
