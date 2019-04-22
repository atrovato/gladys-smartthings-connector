const Promise = require('bluebird');

const smtAPILocation = require('../api/locations.js');
const status = require('../status.js');
const shared = require('../shared.js');

/**
 * List SmartThings locations.
 */
module.exports = function () {
  status.progress(status.step.location.list);
  // Get all SmartThings locations
  return smtAPILocation.list()
    .then((locations) => {
      return gladys.house.getAll()
        .then((houses) => {
          return Promise.resolve({ locations: locations, houses: houses });
        }).then((result) => {
          return gladys.param.getValue(shared.smtLocationLinkParam)
            .then((param) => {
              const links = JSON.parse(param);
              result.houses.forEach((house) => {
                const link = links['' + house.id];
                if (link) {
                  house.locationId = link;
                }
              });
              return Promise.resolve(result);
            }).catch(() => {
              return Promise.resolve(result);
            }).finally(() => {
              status.done(status.step.location.list);
            });
        });
    }).catch((e) => {
      status.fail(status.step.location.list);
      return Promise.reject(e);
    });
};