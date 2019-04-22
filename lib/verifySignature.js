const httpSignature = require('http-signature');
const Promise = require('bluebird');

const shared = require('./shared.js');

/**
 * Verifies that the request is actually from SmartThings.
 * @returns true if verified, false otherwise.
 */
module.exports = function signatureIsVerified(req) {
  return gladys.param.getValue(shared.smtPublicKeyParam)
    .then((publicKey) => {
      const parsed = httpSignature.parseRequest(req);
      if (!httpSignature.verifySignature(parsed, publicKey)) {
        return Promise.reject('Forbidden - failed verifySignature');
      }
      return Promise.resolve();
    });
};
