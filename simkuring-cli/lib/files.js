var fs      = require('fs');
var path    = require('path');
var chalk   = require('chalk');
var XLSX    = require('xlsx');

module.exports = {
  getCurrentDirectoryBase : function() {
    return path.basename(process.cwd());
  },

  fileExists : function(fileName) {
    try {
      if (fs.existsSync(fileName)) {
        console.log(chalk.green('==> File exists'));
        return true;
      } else {
        console.log(chalk.red('==> File not exists!'));
        return false;
      }
    } catch (err) {
      return false;
    }
  },

  readFile: function(fileName) {
    var workbook = XLSX.readFile(fileName);
    var first_sheet_name = workbook.SheetNames[0];

    /* Get worksheet */
    var worksheet = workbook.Sheets[first_sheet_name];
    return XLSX.utils.sheet_to_json(worksheet);
  }
};
