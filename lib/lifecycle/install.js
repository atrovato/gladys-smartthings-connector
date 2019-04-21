const apiUtils = require('../api/util.js');
const Promise = require('bluebird');

module.exports = function (evt) {
  return apiUtils.updateDevices(evt.installData, [])
    .then((e) => {
      Promise.resolve({installData: {}});
    });
};
