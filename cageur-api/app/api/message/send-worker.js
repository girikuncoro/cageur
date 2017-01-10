const taskQueue = require('../../util/task-queue');

const Line = require('../../util/line');

// line send text wrapper to get RabbitMQ message buffer
const processTask = (dataList) => {
  dataList.forEach((data) => {
    Line.sendText(data.lineUserId, data.body);
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
