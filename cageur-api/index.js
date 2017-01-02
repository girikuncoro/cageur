const express = require('express');
const debug = require('debug')('cageur');

const app = express();

app.set('port', (process.env.PORT || 5000));

app.use('/', require('./app/api/test'));

app.listen(app.get('port'), () => {
  debug('Node app is running on port', app.get('port'));
});
