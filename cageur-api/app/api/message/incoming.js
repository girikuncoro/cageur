const router = require('express').Router();
const db = require('../../config/db');
const abort = require('../../util/abort');
const IncomingMessage = require('../../model/message.js');
const Line = require('../../util/line');

/**
* Incoming message from Line webhook
* POST /api/v1/message/incoming
*/
router.post('/', (req, res, next) => {
  const message = new IncomingMessage(req.body);

  if (!message.valid) {
    throw abort(400, 'Invalid message request', JSON.stringify(message));
  }

  if (message.isFollow) {
    return Line.sendText(message.from, message.getResponse('addFriend'));
  }

  if (message.isMessage) {
    db.any(`SELECT id FROM patient WHERE line_user_id = '${message.from}'`)
    .then((data) => {
      if (data.length > 0) {
        throw new Error('exist');
      }
      return message.isValidPhone();
    })
    .then((valid) => {
      if (!valid) {
        throw new Error('phoneTypo');
      }
      return db.any(`
        UPDATE patient
        SET line_user_id = '${message.from}'
        WHERE phone_number = '${message.text}'
        RETURNING id
      `);
    })
    .then((data) => {
      if (data.length === 0) {
        return message.getResponse('phoneFailed');
      }
      return message.getResponse('phoneSucceed');
    })
    .then(responseMessage => Line.sendText(message.from, responseMessage))
    .catch((err) => {
      if (err.message === 'exist') {
        return Line.sendText(message.from, message.getResponse('exist'));
      }
      if (err.message === 'phoneTypo') {
        return Line.sendText(message.from, message.getResponse('phoneTypo'));
      }
      return next(err);
    });
  }
});

module.exports = router;
