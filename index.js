const SmartThingsController = require('./controller/SmartThingsController.js');

module.exports = function (sails) {
  return {
    routes: {
      before: {
        'get /smartthings-connector/webhook': (req, res, next) => sails.hooks.policies.middleware.checktoken(req, res, next)
      },
      after: {
        'get /smartthings-connector/webhook': SmartThingsController.webhook
      }
    }
  };
};