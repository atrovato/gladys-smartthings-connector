
const reconcileProfiles = require('./profiles/reconcileProfiles.js/index.js');

module.exports = () => {
  // Load Gladys devices
  return gladys.device.get({ skip: 0, take: 5000 })
    .then((gladysDevices) => {
      // Reconcile profiles
      return reconcileProfiles(gladysDevices);
    });
};
