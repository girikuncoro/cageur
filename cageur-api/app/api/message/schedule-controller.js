const db = require('../../config/db');
const abort = require('../../util/abort');
const moment = require('moment');

const ctl = {
  scheduleMessage(req, res, next) {
    const clinicID = req.params.id;
    const message = {
      diseaseGroup: req.body['disease_group'],
      body: req.body['body'],
      frequency: req.body['frequency'],
      // Example: '2017-01-30 23:30' at UTC
      scheduledAt: req.body['scheduled_at'],
    };

    if (!message.diseaseGroup || !message.body || !message.frequency || !message.scheduledAt) {
      throw abort(400, 'Missing required parameters "disease_group" or "body" or "frequency" or "scheduled_at"');
    }

    const date = moment(message.scheduledAt, 'YYYY-MM-DD HH:mm', true);
    if (!date.isValid()) {
      throw abort(400, 'Bad scheduled_at format, valid example: "2015-01-30 23:30" in UTC');
    }

    const bodyShorten = message.body.split(/[ ]+/).slice(0, 5).join(' ');

    db.one(`
      INSERT INTO scheduled_message(clinic_id, disease_group_id, title, content, frequency, scheduled_at)
      VALUES(${clinicID}, ${message.diseaseGroup}, '${bodyShorten}', '${message.body}', '${message.frequency}', '${message.scheduledAt}')
      RETURNING id, clinic_id, disease_group_id, title, content, frequency, scheduled_at, created_at, updated_at
    `)
    .then((data) => {
      res.status(200).json({
        status: 'success',
        data,
        message: `Group ${message.diseaseGroup} has been scheduled`,
      });
    })
    .catch(err => next(err));
  },

  getAllScheduledMessages(req, res, next) {
    db.any('SELECT * FROM scheduled_message')
    .then((data) => {
      if (data.length === 0) {
        throw abort(404, 'No scheduled message data yet', 'Empty scheduled_message table');
      }

      return res.status(200).json({
        status: 'success',
        data,
        message: 'Retrieved all scheduled message data',
      });
    })
    .catch(err => next(err));
  },

  getScheduledMessagesByClinicID(req, res, next) {
    const clinicID = req.params.id;
    db.any(`SELECT * FROM scheduled_message WHERE clinic_id=${clinicID}`)
    .then((data) => {
      if (data.length === 0) {
        throw abort(404, 'No scheduled message data yet', `Empty scheduled_message table for clinic ${clinicID}`);
      }

      return res.status(200).json({
        status: 'success',
        data,
        message: 'Retrieved all scheduled message data',
      });
    })
    .catch(err => next(err));
  },
};

module.exports = ctl;
