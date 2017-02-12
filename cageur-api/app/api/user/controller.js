const db = require('../../config/db');
const abort = require('../../util/abort');

const ctl = {
  createUser(req, res, next) {
    const user = {
      name: req.body.name,
      email: req.body.email,
      password: req.body.password,
      role: req.body.role,
    };

    if (!user.name) {
      throw abort(400, 'Missing required parameters "name"');
    }
    if (!user.email) {
      throw abort(400, 'Missing required parameters "email"');
    }
    if (!user.password) {
      throw abort(400, 'Missing required parameters "password"');
    }
    if (!user.role) {
      throw abort(400, 'Missing required parameters "role"');
    }

    db.any(`
      INSERT INTO user(role, name, email, password)
      VALUES($(role), $(name), $(email), $(password))
      RETURNING id, role, name, email, created_at, updated_at`, user
    )
    .then((data) => {
      res.status(200).json({
        status: 'success',
        data: data[0],
        message: 'user data succesfully added to db',
      });
    })
    .catch(err => next('Email address exist'));
  },

  getAllUser(req, res, next) {
    db.any('SELECT * FROM user')
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
      SELECT *
      FROM user
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
    const user = {
      id: req.params.id,
      name: req.body.name,
      email: req.body.email,
      password: req.body.password,
      role: req.body.role,
    };

    if (!user.id) {
      throw abort(400, 'Missing required parameters "id"');
    }
    if (!user.name) {
      throw abort(400, 'Missing required parameters "name"');
    }
    if (!user.email) {
      throw abort(400, 'Missing required parameters "email"');
    }
    if (!user.password) {
      throw abort(400, 'Missing required parameters "password"');
    }
    if (!user.role) {
      throw abort(400, 'Missing required parameters "role"');
    }

    db.one(`
      UPDATE users
      SET name=$(name), email=$(email), password=$(password), role=$(role)
      WHERE id = $(id)
      RETURNING id, name, email, role, created_at, updated_at`,
      users
    )
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

    db.result(`DELETE FROM user WHERE id = ${userID}`)
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
