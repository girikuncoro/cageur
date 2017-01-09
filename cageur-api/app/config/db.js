const promise = require('bluebird');
const pgp = require('pg-promise')({ promiseLib: promise });

// database connection details
const connection = {
    host: 'localhost',
    port: 5432,
    database: 'cageur_db',
    user: 'cageur_user',
    password: '123456',
};

const db = pgp(connection);

module.exports = db;
