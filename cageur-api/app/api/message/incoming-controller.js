/* eslint-disable consistent-return */
const db = require('../../config/db');
const Line = require('../../util/line');
const IncomingMessage = require('../../model/message');

const ctl = message => new Promise((resolve, reject) => {
  if (!message.valid) {
    return reject('Invalid message request');
  }

  if (message.isFollow) {
    return resolve(Line.sendText(message.from, IncomingMessage.getResponse('addFriend')));
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
        return IncomingMessage.getResponse('phoneFailed');
      }
      return IncomingMessage.getResponse('phoneSucceed');
    })
    .then(responseMessage => resolve(Line.sendText(message.from, responseMessage)))
    .catch((err) => {
      if (err.message === 'exist') {
        return resolve(Line.sendText(message.from, IncomingMessage.getResponse('exist')));
      }
      if (err.message === 'phoneTypo') {
        return resolve(Line.sendText(message.from, IncomingMessage.getResponse('phoneTypo')));
      }
      return reject(err);
    });
  }
});

module.exports = ctl;
