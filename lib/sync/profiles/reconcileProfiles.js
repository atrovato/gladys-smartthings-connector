const Promise = require('bluebird');

const determineProfile = require('./determineProfiles.js');
const syncProfiles = require('./syncProfiles.js');

module.exports = (gladysDevices) => {
  const profileMap = new Map();
  const profileByDeviceMap = new Map();

  return Promise.map(gladysDevices, (gladysDevice) => {
    return determineProfile(gladysDevice)
      .then((profile) => {
        profileMap.set(profile.name, profile);
        profileByDeviceMap.set(gladysDevice.id, profile.name);
      }).catch((e) => {
        console.debug('SmartThings Connector : Device', gladysDevice.id, e);
      });
  }).then(() => {
    return syncProfiles(profileMap);
  }).then(() => {
    const map = new Map();
    profileByDeviceMap.forEach((profileKey, device) => {
      map.set(device, profileMap.get(profileKey));
    });
    return Promise.resolve(map);
  });
};