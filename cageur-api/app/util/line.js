const debug = require('debug')('cageur');
const request = require('superagent-promise')(require('superagent'), Promise);

const { lineChannelID, lineChannelSecret, lineChannelToken } = require('../config');

const header = {
  'Content-Type': 'application/json; charset=UTF-8',
  'Authorization': `Bearer ${lineChannelToken}`,
};
const lineUrl = 'https://api.line.me/v2/bot/message/push';

module.exports = {
  // send plain text message through Line REST API
  sendText(lineUserId, body) {
    const data = {
      to: lineUserId,
      messages: [{ type: 'text', text: body }],
    };

    request.post(lineUrl)
    .set(header)
    .send(data)
    .then(
      res => debug(`Successfully sending message to ${lineUserId}: ${body}`),
      err => {
        const errMessage = err.response.res.text;
        debug(`Failed sending message to ${lineUserId}: ${body}`, errMessage);
      }
    );
  }
};
