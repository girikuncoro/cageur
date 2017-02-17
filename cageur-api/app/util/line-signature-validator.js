const crypto = require('crypto');
const { lineChannelSecret } = require('../config');

const SIGNATURE_HEADER = 'x-line-signature';
const HASH_ALGORITHM = 'sha256';

const generateSignature = (key, body) => {
  let hmac = crypto.createHmac(HASH_ALGORITHM, key);
  hmac = hmac.update(body);
  return hmac.digest('base64');
};

const validateSignature = (req, res, next) => {

    const channelSecret = lineChannelSecret;
    if (!channelSecret) {
      throw new Error('A channel secret is required');
    }
    if (!req.headers[SIGNATURE_HEADER]) {
      throw new Error('A signature header is required');
    }
    // generate & validate signature from request header
    if (req.headers[SIGNATURE_HEADER] === generateSignature(channelSecret, req.rawBody)) {
      next();
    } else {
      next(new Error('Signature validation is failed'));
    }
};

module.exports = { validateSignature };
