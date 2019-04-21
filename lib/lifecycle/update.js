const st = require('../api/smartthingsAPI.js');
const apiUtils = require('../api/util.js');
const Promise = require('bluebird');

module.exports = function (evt) {
  let updateData = evt.updateData;
  let token = updateData.authToken;
  let installedAppId = updateData.installedApp.installedAppId;

  return st.listDevices(token, installedAppId).then(function (list) {
    return apiUtils.updateDevices(updateData, list);
  }).then(() => {
    return Promise.resolve({ updateData: {} });
  });
};