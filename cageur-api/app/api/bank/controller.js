const db = require('../../config/db');
const abort = require('../../util/abort');

const ctl = {
  createBank(req, res, next) {
    const bank = {
      name: req.body.name,
      account_holder: req.body.account_holder,
      account_number: req.body.account_number,
    };

    if (!bank.name) {
      throw abort(400, 'Missing required parameters "name"');
    }

    db.any(`
      INSERT INTO bank(name, account_holder, account_number)
      VALUES($(name), $(account_holder), $(account_number))
      RETURNING id, name, account_holder, account_number, created_at, updated_at`, bank
    )
    .then((data) => {
      res.status(200).json({
        status: 'success',
        data: data[0],
        message: 'Bank data succesfully added to db',
      });
    })
    .catch(err => next(err));
  },

  getAllBank(req, res, next) {
    db.any('SELECT * FROM bank')
    .then((data) => {
      if (data.length === 0) {
        throw abort(404, 'No bank data yet', 'Empty bank table');
      }

      return res.status(200).json({
        status: 'success',
        data,
        message: 'Retrieved all bank data',
      });
    })
    .catch(err => next(err));
  },

  getSingleBank(req, res, next) {
    const bankID = req.params.id;

    db.any(`
      SELECT *
      FROM bank
      WHERE id = ${bankID}
    `)
    .then((data) => {
      if (data.length === 0) {
        throw abort(404, 'No bank data found', `Clinic ${bankID} not found`);
      }
      return res.status(200).json({
        status: 'success',
        data: data[0],
        message: 'Retrieved one bank',
      });
    })
    .catch(err => next(err));
  },

  updateBank(req, res, next) {
    const bank = {
      id: req.params.id,
      name: req.body.name,
      account_holder: req.body.account_holder,
      account_number: req.body.account_number,
    };

    if (!bank.name) {
      throw abort(400, 'Missing required parameters "name"');
    }

    db.one(`
      UPDATE bank
      SET name=$(name), account_holder=$(account_holder), account_number=$(account_number)
      WHERE id = $(id)
      RETURNING id, name, account_holder, account_number, created_at, updated_at`,
      bank
    )
    .then((data) => {
      res.status(200).json({
        status: 'success',
        data,
        message: 'Bank data has been updated',
      });
    })
    .catch(err => next(err));
  },

  removeBank(req, res, next) {
    const bankID = req.params.id;

    db.result(`DELETE FROM bank WHERE id = ${bankID}`)
    .then((result) => {
      if (result.rowCount === 0) {
        throw abort(404, 'Bank not exist or already removed', `${bankID} not found`);
      }
      return res.status(200).json({
        status: 'success',
        message: 'Bank has been removed',
      });
    })
    .catch(err => next(err));
  },
};

module.exports = ctl;
