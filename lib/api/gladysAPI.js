const Promise = require('bluebird');

module.exports = {
  loadDevices: function (from = 0, gDevices = new Map()) {
    return gladys.device.get({ skip: from, take: 50 })
      .then((devices) => {
        return Promise.map(devices, (d) => {
          if (d.protocol === 'bluetooth-mesh') {
            gDevices.set(d.id, d);
            return gladys.deviceType.getByDevice(d).then((deviceTypes) => {
              d.types = deviceTypes;
            });
          }
        }).then(() => {
          if (devices.length < 50) {
            return Promise.resolve(gDevices);
          } else {
            return loadDevices(from + 50, gDevices);
          }
        });
      });
  }
};