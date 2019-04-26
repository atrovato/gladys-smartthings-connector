const syncProfilesAndDevices = require('../sync/syncProfilesAndDevices.js');
const oauth = require('../api/oauth.js');

module.exports = (data) => {
  let token = data.authToken;
  let installedAppId = data.installedApp.installedAppId;

  return syncProfilesAndDevices(token, installedAppId)
    .then(() => {
      return oauth.storeRefreshToken(data);
    });
};
