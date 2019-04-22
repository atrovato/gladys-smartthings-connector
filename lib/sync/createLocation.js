const Promise = require('bluebird');

const smtAPILocation = require('../api/locations.js');
const status = require('../status.js');

/**
 * Create the SmartThings location in parameter.
 */
module.exports = function (location) {
  status.progress(status.step.location.create);
  // Get all SmartThings locations
  return smtAPILocation.create(location)
    .then((location) => {
      status.done(status.step.location.create);
      return Promise.resolve(location);
    }).catch((e) => {
      status.fail(status.step.location.create);
      return Promise.reject(e);
    });
};