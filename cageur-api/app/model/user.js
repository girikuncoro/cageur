const bcrypt = require('bcrypt');

const ROLES = ['superadmin', 'clinic'];

class User {
  constructor(args) {
    this.email = args.email || '';
    this.name = args.name || '';
    this.password = args.password || '';
    this.role = args.role || '';

    this.valid = args.email && args.password && args.role;
  }

  isValidEmail() {
    const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(this.email);
  }

  isValidRole() {
    return ROLES.indexOf(this.role) > -1;
  }

  isValidPassword() {
    // at least 1 number, 1 alphabet, 1 special charater, 8 length
    const re = /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/;
    return re.test(this.password);
  }

  encryptPassword() {
    return new Promise((resolve, reject) => {
      bcrypt.genSalt(10, (err, salt) => {
        if (err) {
          return reject('Salt error: ', err);
        }
        bcrypt.hash(this.password, salt, (err, hash) => {
          if (err) {
            return reject('Hash error: ', err);
          }
          this.password = hash;
          return resolve(true);
        });
      });
    });
  }

  // compare password input with db password
  static comparePassword(inputPass, hashedPass) {
    return new Promise((resolve, reject) => {
      bcrypt.compare(inputPass, hashedPass)
      .then(res => resolve(res), err => reject(err));
    });
  }

  // find user with given id
  static findOneByID(db, userID) {
    return new Promise((resolve, reject) => {
      db.any(`SELECT * FROM cageur_user WHERE id = ${userID}`)
      .then(
        (user) => {
          if (user.length === 0) {
            reject('User not exist');
          }
          resolve(user[0]);
        },
        err => reject(err)
      );
    });
  }

  // find user with given email
  static findOneByEmail(db, email) {
    return new Promise((resolve, reject) => {
      db.any(`SELECT * FROM cageur_user WHERE email = '${email}'`)
      .then(
        (user) => {
          if (user.length === 0) {
            reject('User not exist');
          }
          resolve(user[0]);
        },
        err => reject(err)
      );
    });
  }
}

module.exports = User;
