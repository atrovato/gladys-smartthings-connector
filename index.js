const SmartThingsController = require('./controller/SmartThingsController.js');

module.exports = function (sails) {
  return {
    routes: {
      before: {
        'post /smartthings-connector/webhook': (req, res, next) => sails.hooks.policies.middleware.checktoken(req, res, next)
      },
      after: {
        'post /smartthings-connector/webhook': SmartThingsController.webhook
      }
    }
  };
};