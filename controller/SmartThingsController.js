const verifySignature = require('../lib/verifySignature.js');
const handleRequest = require('../lib/handleRequest.js');

module.exports = {
  webhook: function (req, res, next) {
    // We don't yet have the public key during PING (when the app is created),
    // so no need to verify the signature. All other requests are verified.
    if (req.body) {
      if (req.body.lifecycle === 'PING') {
        handleRequest(req, res);
      } else {
        return verifySignature(req)
          .then(() => {
            handleRequest(req, res);
          }).catch((e) => {
            console.error('SmartThings Connector : ' + e);
            res.status(401).send('Forbidden');
          });
      }
    } else {
      console.error('SmartThings Connector : Forbidden');
      res.status(401).send('Forbidden');
    }
  }
};