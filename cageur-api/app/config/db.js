const promise = require('bluebird');
const pgp = require('pg-promise')({ promiseLib: promise });

const db = pgp(require('../config').postgresUrl);

module.exports = db;
