const SmartThingsController = require('./controller/SmartThingsController.js');
const handleCommand = require('./lib/sync/command/handleCommand.js');

module.exports = function (sails) {
  handleCommand();

  return {
    routes: {
      before: {
        'post /smartthings-connector/webhook': (req, res, next) => sails.hooks.policies.middleware.checktoken(req, res, next),
        'get /smartthings-connector/load-configuration': (req, res, next) => sails.hooks.policies.middleware.checktoken(req, res, next),
        'post /smartthings-connector/install-app': (req, res, next) => sails.hooks.policies.middleware.checktoken(req, res, next),
        'get /smartthings-connector/load-locations': (req, res, next) => sails.hooks.policies.middleware.checktoken(req, res, next),
        'post /smartthings-connector/create-location': (req, res, next) => sails.hooks.policies.middleware.checktoken(req, res, next),
        'post /smartthings-connector/save-locations': (req, res, next) => sails.hooks.policies.middleware.checktoken(req, res, next)
      },
      after: {
        'post /smartthings-connector/webhook': SmartThingsController.webhook,
        'get /smartthings-connector/load-configuration': SmartThingsController.loadConfiguration,
        'post /smartthings-connector/install-app': SmartThingsController.installApp,
        'get /smartthings-connector/load-locations': SmartThingsController.loadLocations,
        'post /smartthings-connector/create-location': SmartThingsController.createLocation,
        'post /smartthings-connector/save-locations': SmartThingsController.saveLocations
      }
    }
  };
};