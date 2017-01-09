const debug = require('debug')('cageur');

// Abort interrupts route handler to error handler
const abort = (status, message, stack) => {
  const err = new Error(message);
  err.status = status;
  debug(`error: ${stack}`);

  return err;
};

module.exports = { abort };
