
const reconcileProfiles = require('./profiles/reconcileProfiles.js');
const reconcileDevices = require('./devices/reconcileDevices.js');
const shared = require('../shared.js');

module.exports = (token, installedAppId) => {
  // Load Gladys devices
  return gladys.device.get({ skip: 0, take: 5000 })
    .then((gladysDevices) => {
      // Reconcile profiles
      return reconcileProfiles(gladysDevices).then((profileByDeviceMap) => {
        // Fill devices
        return reconcileDevices(token, installedAppId, gladysDevices, profileByDeviceMap);
      });
    }).then(() => {
      return gladys.module.get()
        .then(modules => {
          for (let m of modules) {
            if (m.slug === 'smartthings-connector') {
              return Promise.resolve(m.id);
            }
          }

          return Promise.reject('Gladys module not found');
        }).then((moduleId) => {
          const param = {
            name: shared.smtAppTokenParam,
            value: token,
            description: 'SMT App token',
            module: moduleId
          };
          return gladys.param.setValue(param);
        });
    });
};
