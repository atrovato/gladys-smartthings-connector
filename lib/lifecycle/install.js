const Promise = require('bluebird');

module.exports = function (evt, response) {
  let token = evt.installData.authToken;
  console.log('INSTALL', evt.installData.installedApp, token);
  response.json({ statusCode: 200, installData: {} });
  return Promise.resolve();
};