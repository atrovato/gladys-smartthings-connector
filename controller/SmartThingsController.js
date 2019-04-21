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
            return verifySignature(req)
              .catch((e) => {
                return Promose.reject({ errorCode: 401, message: 'Forbidden', cause: e });
              });
          }
        } else {
          return Promise.reject('Request body is missing');
        }
      }).then(() => {
        return handleRequest(req);
      }).then((response) => {
        response.statusCode = response.statusCode || 200;
        res.json(response);
      }).catch((e) => {
        res.status(e.errorCode || 500).send(e.message || 'Error');
        console.error('SmartThings Connector : ' + (e.cause || e));
      });
  }
};