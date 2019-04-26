const Promise = require('bluebird');

const syncProfilesAndDevices = require('../sync/syncProfilesAndDevices.js');
const oauth = require('../api/oauth.js');

module.exports = (evt) => {
  let installData = evt.installData;
  let token = installData.authToken;
  let installedAppId = installData.installedApp.installedAppId;

  return syncProfilesAndDevices(token, installedAppId)
    .then(() => {
      return oauth.storeRefreshToken(installData);
    }).then(() => {
      return Promise.resolve({ installData: {} });
    });
};
