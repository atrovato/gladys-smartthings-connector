const Promise = require('bluebird');

module.exports = {
  buildDeviceByIdMap: function (devices) {
    let result = new Map();
    devices.forEach((d) => {
      result.set(d.app.externalId, d);
    });

    return Promise.resolve(result);
  },
  buildProfilesByIdMap: function (profiles) {
    let result = new Map();
    profiles.forEach((p) => {
      result.set(p.name, p);
    });

    return Promise.resolve(result);
  }
};