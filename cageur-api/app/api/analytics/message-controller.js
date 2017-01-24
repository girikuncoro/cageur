const db = require('../../config/db');
const abort = require('../../util/abort');

const ctl = {
  getAllMessage(req, res, next) {
    db.any(`
      SELECT time, json_agg(
        json_build_object(
          'clinic_id', ma.clinic_id,
          'disease_group', json_build_object('id', dg.id, 'name', dg.name),
          'pending', ma.pending,
          'failed', ma.failed,
          'delivered', ma.delivered)) AS message
      FROM message_analytics ma
      JOIN disease_group dg
        ON ma.disease_group_id = dg.id
      GROUP BY time
      ORDER BY time ASC
    `)
    .then((data) => {
      if (data.length === 0) {
        throw abort(404, 'No message analytics found', 'Empty message_analytics table');
      }
      res.status(200).json({
        status: 'success',
        data,
        message: 'Retrieved all message analytics',
      });
    })
    .catch(err => next(err));
  },

  getAllMessageWithClinicID(req, res, next) {
    const clinicID = req.params.id;
    db.any(`
      SELECT time, json_agg(
        json_build_object(
          'clinic_id', clinic_id,
          'disease_group_id', disease_group_id,
          'pending', pending,
          'failed', failed,
          'delivered', delivered)) AS message
      FROM message_analytics
      WHERE clinic_id = ${clinicID}
      GROUP BY time
      ORDER BY time ASC
    `)
    .then((data) => {
      if (data.length === 0) {
        throw abort(404, 'No message analytics found', 'Empty message_analytics table');
      }
      res.status(200).json({
        status: 'success',
        data,
        message: 'Retrieved all message analytics by clinic id',
      });
    })
    .catch(err => next(err));
  },
};

module.exports = ctl;
