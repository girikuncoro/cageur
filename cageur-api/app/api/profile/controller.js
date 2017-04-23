const db = require('../../config/db');
const abort = require('../../util/abort');
const User = require('../../model/user');

const ctl = {
  getSelfProfile(req, res, next) {
    const user = req.user;
    res.status(200).json({
      status: 'success',
      data: {
        name: user.name,
        email: user.email,
        role: user.role,
        clinic_id: user['clinic_id'],
      },
      message: 'Retrieved user own profile',
    });
  },

  // must invalidate token after password change
  updateSelfPassword(req, res, next) {
    let user = new User(req.user);
    const password = {
      old: req.body.oldPassword,
      new: req.body.newPassword,
      confirm: req.body.confirmPassword,
    };
    user.password = password.new;

    if (!password.old || !password.new || !password.confirm) {
      throw abort(400, 'Missing required parameters "oldPassword" or "newPassword" or "confirmPassword"');
    }
    if (!user.isValidPassword()) {
      throw abort(400, 'Invalid password requirement, must contain at least 1 special character, uppercase, alphabet, number and minimum 8 characters');
    }
    if (password.old === password.new || password.old === password.confirm) {
      throw abort(400, 'New password cannot be same as old one');
    }
    if (password.new !== password.confirm) {
      throw abort(400, 'New password must be matched');
    }

    user.encryptPassword()
    .then(() => {
      return db.any(`
        UPDATE cageur_user
        SET password = $(password)
        WHERE id = $(id)
        RETURNING id, email, created_at, updated_at`, user
      );
    })
    .then((data) => {
      res.status(200).json({
        status: 'success',
        data: data[0],
        message: 'password successfully updated',
      });
    })
    .catch(err => next(err));
  },
};

module.exports = ctl;
