const taskQueue = require('../../util/task-queue');
const db = require('../../config/db');
const debug = require('debug')('cageur');

const Line = require('../../util/line');

// line send text wrapper to get RabbitMQ message buffer
const processTask = (dataList) => {
  let processed = false;
  dataList.forEach((data, i) => {
    // for now, group messages are successfully delivered when at least 1 patient received message
    Line.sendText(data.lineUserId, data.body).then(
      (_) => {
        if (!processed) {
          processed = true;
          db.any(`
            UPDATE sent_message
            SET processed = 'delivered', processed_at = now()
            WHERE id = ${data.sentMessageID}
          `);
          debug(`Sent message ${data.sentMessageID} successfully processed ${dataList.length} patients`);
        }
      },
      err => debug('Line sending error', err)
    )
    .then(() => {
      if (i === dataList.length - 1 && !processed) {
        db.any(`
          UPDATE sent_message
          SET processed = 'failed', processed_at = now()
          WHERE id = ${data.sentMessageID}
        `);
        debug(`Sent message ${data.sentMessageID} failed to processed ${dataList.length} patients`);
      }
    });
  });
};

// sending message worker, consume task queue then execute
// this script should be run with Heroku process worker
const workerStart = () => {
  taskQueue.consume(processTask);
};

// start forever
workerStart();

module.exports = processTask;
