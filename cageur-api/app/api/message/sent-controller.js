const db = require('../../config/db');
const abort = require('../../util/abort');

const ctl = {
  getAllSent(req, res, next) {
    db.any(`
      SELECT sm.*, row_to_json(dg.*) AS disease_group
      FROM sent_message AS sm
      JOIN disease_group AS dg
      ON sm.disease_group_id = dg.id`)
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
    const clinicID = req.params.id;

    db.any(`
      SELECT sm.*, row_to_json(dg.*) AS disease_group
      FROM sent_message AS sm
      JOIN disease_group AS dg
      ON sm.disease_group_id = dg.id
      WHERE sm.clinic_id = ${clinicID}`)
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
};

module.exports = ctl;
