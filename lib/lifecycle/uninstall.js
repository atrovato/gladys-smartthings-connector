const Promise = require('bluebird');

module.exports = function (evt, response) {
  response.json({ statusCode: 200, uninstallData: {} });
  return Promise.resolve();
};