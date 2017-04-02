var fs      = require('fs');
var path    = require('path');
var chalk   = require('chalk');
var Excel   = require('exceljs');

module.exports = {
  getCurrentDirectoryBase : function() {
    return path.basename(process.cwd());
  },

  fileExists : function(fileName) {
    try {
      return fs.stat(fileName, function(err, status) {
        if(err == null) {
            console.log(chalk.green('==> File exists'));

            // Readfile ...
            var workbook = new Excel.Workbook();
            workbook.csv.readFile(fileName)
                .then(function(worksheet) {
                  console.log(worksheet);
                    // use workbook or worksheet
                });
        } else if(err.code == 'ENOENT') {
            console.log(chalk.red('==> File not exists!'));
        } else {
            console.log(chalk.red('==> Some other error: '), err.code);
        }
      })
    } catch (err) {
      return false;
    }
  }
};
