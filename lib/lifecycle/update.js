const Promise = require('bluebird');

const syncProfilesAndDevices = require('../sync/syncProfilesAndDevices.js');
const oauth = require('../api/oauth.js');

module.exports = function (evt) {
  let updateData = evt.updateData;
  let token = updateData.authToken;
  let installedAppId = updateData.installedApp.installedAppId;

  return syncProfilesAndDevices(token, installedAppId)
    .then(() => {
      return oauth.storeRefreshToken(updateData);
    }).then(() => {
      return Promise.resolve({ updateData: {} });
    });
};