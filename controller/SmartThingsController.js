const verifySignature = require('../lib/verifySignature.js');
const handleRequest = require('../lib/handleRequest.js');

module.exports = {
  webhook: function (req, res, next) {
    // We don't yet have the public key during PING (when the app is created),
    // so no need to verify the signature. All other requests are verified.
    console.log('SmartThingsController req', req);
    if (req.body && req.body.lifecycle === 'PING' || verifySignature(req)) {
      handleRequest(req, res);
    } else {
      res.status(401).send('Forbidden');
    }
  }
};