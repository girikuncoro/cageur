const db = require('../../config/db');
const abort = require('../../util/abort');

const ctl = {
  createClinic(req, res, next) {
    const clinic = {
      name: req.body.name,
      address: req.body.address,
      phoneNumber: req.body['phone_number'],
    };

    if(!req.body.name){
      throw abort(400, 'Missing required parameters "name"');
    }

    db.any(`
      INSERT INTO clinic(name, address, phone_number)
      VALUES($(name), $(address), $(phoneNumber))
      RETURNING id, name, address, phone_number, created_at, updated_at`, clinic
    )
    .then((data) => {
      res.status(200).json({
        status: 'success',
        data: data[0],
        message: 'Clinic data succesfully added to db'
      });
    })
    .catch(err => next(err));
  },

  getAllClinic(req, res, next) {
    db.any('SELECT * FROM clinic')
    .then(function (data) {
      if (data.length === 0) {
        throw abort(404, 'No clinic data yet', 'Empty clinic table');
      }

      return res.status(200).json({
        status: 'success',
        data,
        message: 'Retrieved all clinic data'
      });
    })
    .catch(err => next(err));
  },

  getSingleClinic(req, res, next) {
    const clinicID = req.params.id;

    db.any(`
      SELECT *
      FROM clinic
      WHERE id = ${clinicID}
    `)
    .then((data) => {
      if (data.length === 0) {
        throw abort(404, 'No clinic data found', `Clinic ${clinicID} not found`);
      }
      return res.status(200).json({
        status: 'success',
        data: data[0],
        message: 'Retrieved one clinic',
      });
    })
    .catch(err => next(err));
  },

  updateClinic(req, res, next) {
    const clinic = {
      id: req.params.id,
      name: req.body.name,
      address: req.body.address,
      phoneNumber: req.body['phone_number'],
    };

    db.one(`
      UPDATE clinic
      SET name=$(name), address=$(address), phone_number=$(phoneNumber)
      WHERE id = $(id)
      RETURNING id, name, address, phone_number, created_at, updated_at`,
      clinic
    )
    .then((data) => {
        res.status(200).json({
          status: 'success',
          data,
          message: 'Clinic data has been updated',
        });
    })
    .catch(err => next(err));
  },

  removeClinic(req, res, next) {
    const clinicID = req.params.id;

    db.result(`DELETE FROM clinic WHERE id = ${clinicID}`)
    .then((result) => {
      if (result.rowCount === 0) {
        throw abort(404, 'Clinic not exist or already removed', `${clinicID} not found`);
      }
      return res.status(200).json({
          status: 'success',
          message: `Clinic has been removed`,
      });
    })
    .catch(err => next(err));
  },
};

module.exports = ctl;
