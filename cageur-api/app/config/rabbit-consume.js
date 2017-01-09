// const debug = require('debug')('cageur');
const rabbit = require('amqplib').connect(require('../config').rabbitUrl);

const q = 'cageur_queue';

// consumer
rabbit.then(conn => {
  return conn.createChannel();
})
.then(ch => {
  return ch.assertQueue(q).then(ok => {
    return ch.consume(q, msg => {
      if (msg !== null) {
        console.log(msg.content.toString());
        const message = JSON.parse(msg.content.toString());
        ch.ack(msg);
      }
    });
  });
})
.catch(console.warn);
