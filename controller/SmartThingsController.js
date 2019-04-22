const Promise = require('bluebird');

const installApp = require('../lib/sync/app.js');
const loadConfiguration = require('../lib/sync/loadConfiguration.js');
const saveConfiguration = require('../lib/sync/saveConfiguration.js');
const loadLocations = require('../lib/sync/loadLocations.js');
const createLocation = require('../lib/sync/createLocation.js');
const saveLocations = require('../lib/sync/saveLocations.js');

const verifySignature = require('../lib/verifySignature.js');
const handleRequest = require('../lib/handleRequest.js');

module.exports = {
  loadConfiguration: (req, res, next) => {
    return loadConfiguration()
      .then((data) => {
        res.json(data);
      });
  },
  installApp: (req, res, next) => {
    return saveConfiguration(req.body)
      .then(() => {
        return installApp(req.body);
      }).then(() => {
        res.ok();
      });
  },
  loadLocations: (req, res, next) => {
    return loadLocations()
      .then((data) => {
        res.json(data);
      });
  },
  createLocation: (req, res, next) => {
    return createLocation(req.body)
      .then((data) => {
        res.json(data);
      });
  },
  saveLocations: (req, res, next) => {
    return saveLocations(req.body.houses, req.body.moduleId)
      .then((data) => {
        res.json(data);
      });
  },

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
                return Promise.reject({ errorCode: 401, message: 'Forbidden', cause: e });
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