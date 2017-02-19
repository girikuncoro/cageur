const db = require('../../config/db');
const abort = require('../../util/abort');

const ctl = {
  getAllSent(req, res, next) {
    db.any(`
      SELECT sm.*, row_to_json(dg.*) AS disease_group
      FROM sent_message AS sm
      JOIN disease_group AS dg
      ON sm.disease_group_id = dg.id
      ORDER BY sm.updated_at DESC
    `)
    .then((data) => {
      if (data.length === 0) {
        throw abort(404, 'No sent message found', 'Empty sent_message table');
      }
      res.status(200).json({
        status: 'success',
        data,
        message: 'Retrieved all sent message',
      });
    })
    .catch(err => next(err));
  },

  getAllSentWithClinicID(req, res, next) {
    const clinicID = req.params['clinic_id'];

    db.any(`
      SELECT sm.*, row_to_json(dg.*) AS disease_group
      FROM sent_message AS sm
      JOIN disease_group AS dg
      ON sm.disease_group_id = dg.id
      WHERE sm.clinic_id = ${clinicID}
      ORDER BY sm.updated_at DESC
    `)
    .then((data) => {
      if (data.length === 0) {
        throw abort(404, 'No sent message found', 'Empty sent_message table');
      }
      res.status(200).json({
        status: 'success',
        data,
        message: 'Retrieved all sent message by clinicID',
      });
    })
    .catch(err => next(err));
  },

  getSingleSent(req, res, next) {
    const sentID = req.params.id;

    db.any(`
      SELECT sm.*, row_to_json(dg.*) AS disease_group
      FROM sent_message AS sm
      JOIN disease_group AS dg
      ON sm.disease_group_id = dg.id
      WHERE sm.id = ${sentID}
    `)
    .then((data) => {
      if (data.length === 0) {
        throw abort(404, 'No sent message found', `${sentID} not found`);
      }
      res.status(200).json({
        status: 'success',
        data: data[0],
        message: 'Retrieved single sent message',
      });
    })
    .catch(err => next(err));
  },

  getSingleSentWithClinicID(req, res, next) {
    const sentID = req.params.id;
    const clinicID = req.params['clinic_id'];

    db.any(`
      SELECT sm.*, row_to_json(dg.*) AS disease_group
      FROM sent_message AS sm
      JOIN disease_group AS dg
      ON sm.disease_group_id = dg.id
      WHERE sm.id = ${sentID} AND sm.clinic_id = ${clinicID}
    `)
    .then((data) => {
      if (data.length === 0) {
        throw abort(404, 'No sent message found', `${sentID} not found`);
      }
      res.status(200).json({
        status: 'success',
        data: data[0],
        message: 'Retrieved single sent message',
      });
    })
    .catch(err => next(err));
  },
};

module.exports = ctl;
