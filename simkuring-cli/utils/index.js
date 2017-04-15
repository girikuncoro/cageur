const chalk = require('chalk');

module.exports = {
  print: {
    default(text) {
      console.log(text);
    },
    success(text) {
      console.log(chalk.green(text));
    },
    warning(text) {
      console.log(chalk.yellow(text));
    },
    danger(text) {
      console.log(chalk.red(text));
    },
  }
};