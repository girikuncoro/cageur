const router = require('express').Router();
const db = require('../../config/db');

/**
* Sending message through Line API
* POST /api/v1/message/send
*/
router.post('/', (req, res, next) => {
  const message = {
    diseaseGroup: req.body.diseaseGroup,
    body: req.body.body,
  };
  let getLineUserIds;

  // Getting everyone if all
  if (message.diseaseGroup === 'all') {
    getLineUserIds = db.query(`
      SELECT line_user_id
      FROM patient
      WHERE line_user_id IS NOT NULL`);
  }
  // Getting only requested diseaseGroup
  else {
    getLineUserIds = db.query(`
      SELECT p.line_user_id
      FROM patient_disease_group AS pd
      JOIN patient AS p
      ON pd.patient_id = p.id
      WHERE pd.disease_group_id = $1`, message.diseaseGroup);
  }

  getLineUserIds.then(lineUserIds => {
    lineUserIds.forEach(lineUserId => {
      // TODO: add to task queue
      console.log('adding to task queue');
    });
    return lineUserIds.length;
  })
  .then(queuedLineUserIds => {
    if (!queuedLineUserIds) {
      return {
        status: 'success',
        message: `No Line User Ids found for group ${message.diseaseGroup}`,
        queuedLineUserIds,
      };
    }
    return {
      status: 'success',
      message: `Group ${message.diseaseGroup} has been added to queue`,
      queuedLineUserIds,
    };
  })
  .then(answer => {
    return res.status(200).json(answer);
  });
});

module.exports = router;
