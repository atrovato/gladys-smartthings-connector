const Promise = require('bluebird');

module.exports = {
  loadDevices: function (from = 0, gDevices = []) {
    return gladys.device.get({ skip: from, take: 50 })
      .then((devices) => {
        return Promise.map(devices, (d) => {
          // Work only (from now) with AwoX devices
          if (d.service === 'awox' && d.protocol !== 'bluetooth-remote') {
            return gladys.deviceType.getByDevice(d).then((deviceTypes) => {
              d.types = deviceTypes;
              gDevices.push(d);
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