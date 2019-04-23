const determineDevices = require('./determineDevices.js');
const syncDevices = require('./syncDevices.js');

module.exports = (token, installedAppId, gladysDevices, profileByDeviceMap) => {
  return determineDevices(installedAppId, gladysDevices, profileByDeviceMap)
    .then((expectedDevices) => {
      return syncDevices(token, expectedDevices);
    });
};