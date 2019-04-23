const Promise = require('bluebird');

const smtAPIDevices = require('../../api/devices.js');

module.exports = (token, expectedDevices) => {
  return smtAPIDevices.list(token)
    .then((exstingDevices) => {
      const creationMap = new Map();
      let nbCreated = 0;
      let nbDeleted = 0;

      expectedDevices.forEach((device) => {
        creationMap.set(device.app.externalId, device);
      });

      exstingDevices.forEach((device) => {
        const elem = creationMap.get(device.app.externalId);
        if (!elem || elem.app.profileId !== device.app.profile.id) {
          smtAPIDevices.delete(device.deviceId, token)
            .then(() => {
              nbDeleted++;
            }).catch(function (err) {
              console.error('SmartThings Connector : Device delete error ->', err);
            });
        } else {
          creationMap.delete(device.app.externalId);
        }
      });
      console.log(`SmartThings Connector : ${nbDeleted} deleted devices`);

      // Device in Gladys but not SmartThings, create it
      return Promise.map(creationMap, (creationEntry) => {
        const gladysDevice = creationEntry[1];

        return smtAPIDevices.create(gladysDevice, token)
          .then((device) => {
            nbCreated++;
            return Promise.resolve(device);
          }).catch(function (err) {
            console.error('SmartThings Connector : Device create error ->', err);
            return Promise.reject(err);
          });
      }).then((result) => {
        console.log(`SmartThings Connector : ${nbCreated} created devices`);
        return Promise.resolve(result);
      });
    });
};