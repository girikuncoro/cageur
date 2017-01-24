const db = require('../../config/db');
const abort = require('../../util/abort');

const ctl = {
  getAllMessage(req, res, next) {
    db.any(`
      SELECT time, json_agg(
        json_build_object(
          'clinic_id', clinic_id,
          'disease_group_id', disease_group_id,
          'pending', pending,
          'failed', failed,
          'delivered', delivered)) AS message
      FROM message_analytics
      GROUP BY time
      ORDER BY time ASC
    `)
    .then((data) => {
      if (data.length === 0) {
        throw abort(404, 'No sent message found', 'Empty sent_message table');
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
        throw abort(404, 'No sent message found', 'Empty sent_message table');
      }
      res.status(200).json({
        status: 'success',
        data,
        message: 'Retrieved all message analytics',
      });
    })
    .catch(err => next(err));
  },
};

module.exports = ctl;
