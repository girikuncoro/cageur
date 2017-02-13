const db = require('../../config/db');

const abort = require('../../util/abort');

const ctl = {
  createUser(req, res, next) {
    const users = {
      role: req.body.role,
      first_name: req.body.first_name,
      last_name: req.body.last_name,
      email: req.body.email,
      password: req.body.password,
    };

    if (!users.role) {
      throw abort(400, 'Missing required parameters "role"');
    }
    
    if (users.role === 1) {
      throw abort(400, 'you cant use that role');
    }

    if (!users.email) {
      throw abort(400, 'Missing required parameters "email"');
    }
    
    if (!users.password) {
      throw abort(400, 'Missing required parameters "password"');
    }

    db.any(`
      INSERT INTO users(role, first_name, last_name, email, password)
      VALUES($(role), $(first_name), $(last_name), $(email), $(password))
      RETURNING id, role, first_name, last_name, email, created_at, updated_at`, users
    )
    .then((data) => {
      res.status(200).json({
        status: 'success',
        data: data[0],
        message: 'user data succesfully added to db',
      });
    })
    .catch(err => next(err));
  },

  getAllUser(req, res, next) {
    db.any('SELECT * FROM users')
    .then((data) => {
      if (data.length === 0) {
        throw abort(404, 'No user data yet', 'Empty user table');
      }

      return res.status(200).json({
        status: 'success',
        data,
        message: 'Retrieved all users data',
      });
    })
    .catch(err => next(err));
  },

  getSingleUser(req, res, next) {
    const userID = req.params.id;

    db.any(`
      SELECT *
      FROM users
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
    const users = {
      id: req.params.id,
      role: req.body.role,
      first_name: req.body.first_name,
      last_name: req.body.last_name,
      email: req.body.email,
    };

    if (!users.id) {
      throw abort(400, 'Missing required parameters "id"');
    }

    if (!users.role) {
      throw abort(400, 'Missing required parameters "role"');
    }

    if (!users.email) {
      throw abort(400, 'Missing required parameters "email"');
    }

    db.one(`
      UPDATE users
      SET role=$(role), first_name=$(first_name), last_name=$(last_name), email=$(email)
      WHERE id = $(id)
      RETURNING id, role, first_name, last_name, email, created_at, updated_at`,
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
    db.result(`DELETE FROM users WHERE id = ${userID}`)
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
