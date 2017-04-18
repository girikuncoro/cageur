const chalk = require('chalk');
const fs = require('fs');
const path = require('path');
const xlsx = require('xlsx');
const prettyjson = require('prettyjson');
const table = require('console.table');

const print = {
  table(text) {
    console.table(text);
  },
  default(text) {
    console.log(prettyjson.render(text));
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

const generatePassword = () => {
  return Math.random().toString(36).slice(-8);
};

module.exports = { print, file, generatePassword };