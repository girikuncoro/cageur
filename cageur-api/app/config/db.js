const promise = require('bluebird');
const pgp = require('pg-promise')({ promiseLib: promise });
let db;

if (process.env.NODE_ENV === 'production') {
  db = pgp(require('../config').postgresUrl + '?ssl=true');
} else {
  db = pgp(require('../config').postgresUrl);
}

module.exports = db;
