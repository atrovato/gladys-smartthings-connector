const Promise = require('bluebird');

module.exports = function (evt, response) {
  let token = evt.updateData.authToken;
  console.log('UPDATE', evt.updateData.installedApp, token);
  response.json({ statusCode: 200, updateData: {} });
  return Promise.resolve();
};