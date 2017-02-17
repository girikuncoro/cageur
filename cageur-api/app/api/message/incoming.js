const router = require('express').Router();
const IncomingMessage = require('../../model/message');
const handle = require('../message/incoming-controller');
const abort = require('../../util/abort');
const { validateSignature } = require('../../util/line-signature-validator');

/**
* Incoming message from Line webhook
* POST /api/v1/message/incoming
*/
router.post('/', validateSignature, (req, res, next) => {
  console.log(req.body);
  console.log(req.headers['x-line-signature']);

  const message = new IncomingMessage(req.body);
  handle(message).then(
    _ => res.sendStatus(200),
    _ => next(abort(400, 'Invalid message request', JSON.stringify(message)))
  );
});

module.exports = router;
