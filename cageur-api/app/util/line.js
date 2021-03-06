const debug = require('debug')('cageur');
const request = require('superagent-promise')(require('superagent'), Promise);
const { lineChannelToken } = require('../config');

const header = {
  'Content-Type': 'application/json; charset=UTF-8',
  Authorization: `Bearer ${lineChannelToken}`,
};
const lineUrl = 'https://api.line.me/v2/bot/message/push';

module.exports = {
  // send plain text message through Line REST API
  sendText(lineUserId, body) {
    return new Promise((resolve, reject) => {
      const data = {
        to: lineUserId,
        messages: [{ type: 'text', text: body }],
      };

      request.post(lineUrl)
      .set(header)
      .send(data)
      .then(
        (_) => {
          debug(`Successfully sending message to ${lineUserId}: ${body}`);
          resolve(data);
        },
        (err) => {
          const errMessage = err.response.res.text;
          debug(`Failed sending message to ${lineUserId}: ${body}`, errMessage);
          reject(data);
        }
      );
    });
  },
};
