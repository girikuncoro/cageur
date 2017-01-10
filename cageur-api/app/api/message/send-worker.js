const { abort, taskQueue } = require('../../util');
const Line = require('../../util/line');

/**
* Sending message worker, consume task queue then execute
* This script should be run with Heroku process worker
*/
const workerStart = () => {
  taskQueue.consume(processTask);
};

// line send text wrapper to get RabbitMQ message buffer
const processTask =  (dataList) => {
  dataList.forEach(data => {
    Line.sendText(data.lineUserId, data.body);
  });
};

// start forever
workerStart();

module.exports = processTask;
