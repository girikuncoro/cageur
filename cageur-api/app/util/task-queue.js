const debug = require('debug')('cageur');
const { rabbit, queue } = require('../config/rabbit');

// RabbitMQ task
module.exports = {
  // producer runs per task basis, close channel at the end for efficiency
  produce(tasks) {
    rabbit.then(conn => {
      debug('RabbitMQ connection opened (producer)');
      return conn.createChannel();
    })
    .then(ch => {
      const ok = ch.assertQueue(queue);

      ok.then(() => {
        tasks = JSON.stringify(tasks);
        return ch.sendToQueue(queue, new Buffer(tasks));
        // tasks.forEach(task => {
        //   task = JSON.stringify(task);
        //   return ch.sendToQueue(queue, new Buffer(task));
        // });
      })
      .finally(() => {
        debug('RabbitMQ channel closed (producer)');
        ch.close();
      });
    })
    .catch(err => debug('Error in RabbitMQ producer: ', err));
  },
  // consumer always listens, no need to close channel
  consume(processTask) {
    rabbit.then(conn => {
      debug('RabbitMQ connection opened (consumer)');
      return conn.createChannel();
    })
    .then(ch => {
      const ok = ch.assertQueue(queue);

      ok.then(() => {
        return ch.consume(queue, message => {
          if (message !== null) {
            const data = JSON.parse(message.content.toString());
            processTask(data);
            ch.ack(message);
          }
        });
      });
    })
    .catch(err => debug('Error in RabbitMQ consumer: ', err));;
  },
};
