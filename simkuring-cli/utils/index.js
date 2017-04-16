const chalk = require('chalk');
const fs = require('fs');
const path = require('path');
const xlsx = require('xlsx');

const print = {
  default(text) {
    console.log(text);
  },
  success(text) {
    console.log(chalk.cyan(text));
  },
  warning(text) {
    console.log(chalk.yellow(text));
  },
  danger(text) {
    console.log(chalk.red(text));
  },
};

const file = {
  exist(fileName) {
    return fs.existsSync(fileName) ? true : false;
  },
  read(fileName) {
    const workbook = xlsx.readFile(fileName);
    return xlsx.utils.sheet_to_json(workbook.Sheets[workbook.SheetNames[0]]);
  }
};

module.exports = { print, file };