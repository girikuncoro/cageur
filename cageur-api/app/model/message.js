const response = require('../model/message-response');

class IncomingMessage {
  constructor(args) {
    let event = args.events[0] || { source: {}, message: {} };
    event.message = event.message || {};

    this.type = event.type || '';
    this.replyToken = event.replyToken || '';
    this.from = event.source.userId || '';
    this.timestamp = event.timestamp || null;
    this.text = event.message.text || '';

    this.isFollow = this.type === 'follow';
    this.isMessage = this.type === 'message';

    this.valid = this.replyToken && (this.isFollow || this.from);
  }

  getResponse(option) {
    if (!(option in response)) {
      return 'Maaf sepertinya ada masalah teknis';
    }
    return response[option];
  }

  isValidPhone() {
    return new Promise((resolve, reject) => {
      resolve(
        this.isMessage &&
        this.text.length >= 10 &&
        Number.isInteger(parseInt(this.text, 10))
      );
    });
  }

}

module.exports = IncomingMessage;
