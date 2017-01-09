const router = require('express').Router();
const db = require('../../config/db');
const { abort, taskQueue } = require('../../util');

/**
* Sending message through Line API and RabbitMQ producer
* POST /api/v1/message/send
*/
router.post('/', (req, res, next) => {
  const message = {
    diseaseGroup: req.body.diseaseGroup,
    body: req.body.body,
  };
  let getLineUserIds;

  if (!message.diseaseGroup || !message.body) {
    throw abort(400, `Missing required parameters 'diseaseGroup' or 'body'`);
  }

  // Getting everyone if all
  if (message.diseaseGroup === 'all') {
    getLineUserIds = db.any(`
      SELECT line_user_id
      FROM patient
      WHERE line_user_id IS NOT NULL`);
  }
  // Getting only requested diseaseGroup
  else {
    getLineUserIds = db.any(`
      SELECT p.line_user_id
      FROM patient_disease_group AS pd
      JOIN patient AS p
      ON pd.patient_id = p.id
      WHERE pd.disease_group_id = $1 AND p.line_user_id IS NOT NULL`, message.diseaseGroup);
  }

  getLineUserIds.then(lineUserIds => {
    if (!lineUserIds.length) {
      throw abort(404, `No Line User Ids found for group ${message.diseaseGroup}`);
    }
    const tasks = lineUserIds.map(lineUserId => {
      return {
        lineUserId,
        body: message.body,
      };
    });
    taskQueue.produce(tasks);

    // TODO: insert message into DB

    return lineUserIds.length;
  })
  .then(queuedLineUserIds => {
    return res.status(200).json({
      status: 'success',
      message: `Group ${message.diseaseGroup} has been added to queue`,
      queuedLineUserIds,
      message,
    });
  })
  .catch(err => next(err));
});

module.exports = router;