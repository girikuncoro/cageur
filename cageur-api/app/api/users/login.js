const db = require('../../config/db');

const abort = require('../../util/abort');

const users = {
  getAllUser() {
    return new Promise((resolve, reject) => {
    db.any('SELECT * FROM users')
    .then((data) => {
      if (data.length === 0) { throw abort(404, 'No user data yet', 'Empty user table'); }
      return resolve(data);
    })
    .catch(err => reject(err));
   });
  },
};

module.exports = users;

