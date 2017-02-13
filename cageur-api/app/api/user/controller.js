const db = require('../../config/db');
const abort = require('../../util/abort');

const User = require('../../model/user');

const ctl = {
  createUser(req, res, next) {
    const user = new User({
      name: req.body.name,
      email: req.body.email,
      password: req.body.password,
      role: req.body.role,
    });

    if (!user.valid) {
      throw abort(400, 'Missing required parameters "name" or "email" or "password" or "role"');
    }
    if (!user.isValidEmail()) {
      throw abort(400, 'Invalid email format')
    }
    if (!user.isValidRole()) {
      throw abort(400, 'Invalid role');
    }
    if (!user.isValidPassword()) {
      throw abort(400, 'Invalid password requirement, must contain at least 1 special character, uppercase, alphabet, number and minimum 8 characters')
    }

    user.encryptPassword()
    .then(_ => {
      return db.any(`
        INSERT INTO cageur_user(role, name, email, password)
        VALUES($(role), $(name), $(email), $(password))
        RETURNING id, role, name, email, created_at, updated_at`, user
      );
    })
    .then((data) => {
      res.status(200).json({
        status: 'success',
        data: data[0],
        message: 'user data succesfully added to db',
      });
    })
    .catch(err => next(abort(400, 'Email address exist')));
  },

  getAllUser(req, res, next) {
    db.any('SELECT id, name, email, role FROM cageur_user')
    .then((data) => {
      if (data.length === 0) {
        throw abort(404, 'No user data yet', 'Empty user table');
      }

      return res.status(200).json({
        status: 'success',
        data,
        message: 'Retrieved all user data',
      });
    })
    .catch(err => next(err));
  },

  getSingleUser(req, res, next) {
    const userID = req.params.id;

    db.any(`
      SELECT id, name, email, role
      FROM cageur_user
      WHERE id = ${userID}
    `)
    .then((data) => {
      if (data.length === 0) {
        throw abort(404, 'No user data found', `user ${userID} not found`);
      }
      return res.status(200).json({
        status: 'success',
        data: data[0],
        message: 'Retrieved one user',
      });
    })
    .catch(err => next(err));
  },

  updateUser(req, res, next) {
    const userID = req.params.id;
    const user = new User({
      name: req.body.name,
      email: req.body.email,
      password: req.body.password,
      role: req.body.role,
    });

    if (!user.valid) {
      throw abort(400, 'Missing required parameters "name" or "email" or "password" or "role"');
    }
    if (!user.isValidEmail()) {
      throw abort(400, 'Invalid email format')
    }
    if (!user.isValidRole()) {
      throw abort(400, 'Invalid role');
    }
    if (!user.isValidPassword()) {
      throw abort(400, 'Invalid password requirement, must contain at least 1 special character, uppercase, alphabet, number and minimum 8 characters')
    }

    user.encryptPassword()
    .then(_ => {
      return db.one(`
        UPDATE cageur_user
        SET name=$(name), email=$(email), password=$(password), role=$(role)
        WHERE id = ${userID}
        RETURNING id, name, email, role, created_at, updated_at`,
        user
      );
    })
    .then((data) => {
      res.status(200).json({
        status: 'success',
        data,
        message: 'user data has been updated',
      });
    })
    .catch(err => next(err));
  },

  removeUser(req, res, next) {
    const userID = req.params.id;

    db.result(`DELETE FROM cageur_user WHERE id = ${userID}`)
    .then((result) => {
      if (result.rowCount === 0) {
        throw abort(404, 'user not exist or already removed', `${userID} not found`);
      }
      return res.status(200).json({
        status: 'success',
        message: 'user has been removed',
      });
    })
    .catch(err => next(err));
  },
};

module.exports = ctl;
