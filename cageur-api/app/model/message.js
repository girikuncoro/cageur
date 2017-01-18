class IncomingMessage {
  constructor(events) {
    const event = events[0];

    this.type = event.type;
    this.replyToken = event.replyToken;
    this.from = event.source.userId;
    this.timestamp = event.timestamp;
    this.text = event.message.text;

    this.isFollow = this.type === 'follow';
    this.isText = this.type === 'text';
  }
}

module.exports = Message;
