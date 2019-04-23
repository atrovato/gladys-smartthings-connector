const Promise = require('bluebird');

const syncProfilesAndDevices = require('../sync/syncProfilesAndDevices.js');

module.exports = function (evt) {
  let updateData = evt.updateData;
  let token = updateData.authToken;
  let installedAppId = updateData.installedApp.installedAppId;

  return syncProfilesAndDevices(token, installedAppId)
    .then(() => {
      return Promise.resolve({ updateData: {} });
    });
};