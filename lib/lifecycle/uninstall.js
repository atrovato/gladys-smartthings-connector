const Promise = require('bluebird');

module.exports = function (evt) {
  return Promise.resolve({ uninstallData: {} });
};