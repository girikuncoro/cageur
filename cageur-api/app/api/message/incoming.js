const router = require('express').Router();
const db = require('../../config/db');
const abort = require('../../util/abort');
const IncomingMessage = require('../../model/message.js');

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
    return res.status(200).json({ msg: message.getResponse('addFriend') });
  }

  if (message.isMessage) {
    message.isValidPhone()
    .then((valid) => {
      if (!valid) {
        throw new Error('phoneTypo');
      }
      return db.any(`SELECT id FROM patient WHERE line_user_id = '${message.from}'`);
    })
    .then((data) => {
      if (data.length > 0) {
        throw new Error('exist');
      }
      return db.any(`SELECT id, first_name, last_name FROM patient WHERE phone_number = '${message.text}'`);
    })
    .then((data) => {
      if (typeof data === 'string') {
        return data;
      }
      if (data.length === 0) {
        return message.getResponse('phoneFailed');
      }
      return message.getResponse('phoneSucceed');
    })
    .then((responseMessage) => res.status(200).json({ responseMessage }))
    .catch((err) => {
      if (err.message === 'exist') {
        return res.status(200).json({ msg: message.getResponse('exist') });
      }
      if (err.message === 'phoneTypo') {
        return res.status(200).json({ msg: message.getResponse('phoneTypo') });
      }
      return next(err);
    });
  }
});

module.exports = router;
