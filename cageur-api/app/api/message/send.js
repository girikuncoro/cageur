const router = require('express').Router();
const db = require('../../config/db');
const abort = require('../../util/abort');
const taskQueue = require('../../util/task-queue');

/**
* Sending message through Line API and RabbitMQ producer
* POST /api/v1/message/send
*/
// TODO: Drawback compatibility, remove this once UI has been fixed
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

/**
* Sending message through Line API and RabbitMQ producer
* POST /api/v1/message/send/clinic/:id
*/
router.post('/clinic/:id', (req, res, next) => {
  const clinicID = req.params.id;
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
      WHERE line_user_id IS NOT NULL and clinic_id = ${clinicID}`);
  } else {
    // Getting only requested diseaseGroup
    getLineUserIds = db.any(`
      SELECT p.line_user_id
      FROM patient_disease_group AS pd
      JOIN patient AS p
      ON pd.patient_id = p.id
      WHERE pd.disease_group_id = $1 AND p.line_user_id IS NOT NULL and p.clinic_id = ${clinicID}`,
      message.diseaseGroup);
  }

  getLineUserIds.then((lineUserIds) => {
    if (!lineUserIds.length) {
      throw abort(404, 'No Line User Ids found', `Group ${message.diseaseGroup} in clinic ${clinicID} not found`);
    }
    const tasks = lineUserIds.map(lineUserId => ({
      lineUserId: lineUserId['line_user_id'],
      body: message.body,
    }));
    taskQueue.produce(tasks);

    const bodyShorten = message.body.split(/[ ]+/).slice(0,5).join(' ');
    db.any(`
      INSERT INTO sent_message(clinic_id, disease_group_id, title, content)
      VALUES(${clinicID}, ${message.diseaseGroup}, '${bodyShorten}', '${message.body}')
    `);

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
