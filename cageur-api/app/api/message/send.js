const router = require('express').Router();
const db = require('../../config/db');
const abort = require('../../util/abort');
const taskQueue = require('../../util/task-queue');

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
    throw abort(400, 'Missing required parameters "diseaseGroup" or "body"');
  }

  // Getting everyone if all
  if (message.diseaseGroup === 'all') {
    getLineUserIds = db.any(`
      SELECT line_user_id
      FROM patient
      WHERE line_user_id IS NOT NULL`);
  } else {
    // Getting only requested diseaseGroup
    getLineUserIds = db.any(`
      SELECT p.line_user_id
      FROM patient_disease_group AS pd
      JOIN patient AS p
      ON pd.patient_id = p.id
      WHERE pd.disease_group_id = $1 AND p.line_user_id IS NOT NULL`, message.diseaseGroup);
  }

  getLineUserIds.then((lineUserIds) => {
    if (!lineUserIds.length) {
      throw abort(404, 'No Line User Ids found', `${message.diseaseGroup} not found`);
    }
    const tasks = lineUserIds.map(lineUserId => ({
      lineUserId: lineUserId['line_user_id'],
      body: message.body,
    }));
    taskQueue.produce(tasks);

    // TODO: insert message into DB for audit/analytics

    return lineUserIds.length;
  })
  .then((queuedLineUserIds) => {
    res.status(200).json({
      status: 'success',
      data: { queuedLineUserIds, message },
      message: `Group ${message.diseaseGroup} has been added to queue`,
    });
  })
  .catch(err => next(err));
});

module.exports = router;
