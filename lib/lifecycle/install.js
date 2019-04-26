const Promise = require('bluebird');

const syncProfilesAndDevices = require('../sync/syncProfilesAndDevices.js');
const saveToken = require('./saveToken.js');

module.exports = (evt) => {
  let installData = evt.installData;
  let token = installData.authToken;
  let installedAppId = installData.installedApp.installedAppId;

  return syncProfilesAndDevices(token, installedAppId)
    .then(() => {
      return saveToken(token);
    }).then(() => {
      return Promise.resolve({ installData: {} });
    });
};
