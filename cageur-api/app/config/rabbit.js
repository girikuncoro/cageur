const debug = require('debug')('cageur');
const rabbit = require('amqplib').connect(require('../config').rabbitUrl);

const queue = 'cageur_queue';

module.exports = { rabbit, queue };
