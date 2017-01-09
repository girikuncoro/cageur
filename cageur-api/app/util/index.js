const debug = require('debug')('cageur');
const { rabbit, queue } = require('../config/rabbit');

// Abort interrupts route handler to error handler
const abort = (status, message, stack) => {
  const err = new Error(message);
  err.status = status;
  debug(`error: ${stack}`);

  return err;
};

// RabbitMQ task
const taskQueue = {
  produce(tasks) {
    rabbit.then(conn => {
      debug('RabbitMQ connection opened');
      return conn.createChannel();
    })
    .then(ch => {
      const ok = ch.assertQueue(queue);

      ok.then(() => {
        tasks.forEach(task => {
          task = JSON.stringify(task);
          return ch.sendToQueue(queue, new Buffer(task));
        });
      })
      .finally(() => {
        debug('RabbitMQ channel closed');
        ch.close();
      });
    });
  }
};

module.exports = { abort, taskQueue };
