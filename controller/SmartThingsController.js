const verifySignature = require('../lib/verifySignature.js');
const handleRequest = require('../lib/handleRequest.js');
const Promise = require('bluebird');

module.exports = {
  webhook: function (req, res, next) {
    // We don't yet have the public key during PING (when the app is created),
    // so no need to verify the signature. All other requests are verified.

    return Promise.resolve()
      .then(() => {
        if (req.body) {
          if (req.body.lifecycle === 'PING') {
            return Promise.resolve();
          } else {
            return verifySignature(req);
          }
        } else {
          return Promise.reject('Request body is missing');
        }
      }).then(() => {
        return handleRequest(req, res);
      }).catch((e) => {
        console.error('SmartThings Connector : ' + e);
        res.status(401).send('Forbidden');
      });
  }
};