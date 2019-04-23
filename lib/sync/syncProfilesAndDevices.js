
const reconcileProfiles = require('./profiles/reconcileProfiles.js');
const reconcileDevices = require('./devices/reconcileDevices.js');

module.exports = (token, installedAppId) => {
  // Load Gladys devices
  return gladys.device.get({ skip: 0, take: 5000 })
    .then((gladysDevices) => {
      // Reconcile profiles
      return reconcileProfiles(gladysDevices).then((profileByDeviceMap) => {
        // Fill devices
        return reconcileDevices(token, installedAppId, gladysDevices, profileByDeviceMap);
      });
    });
};
