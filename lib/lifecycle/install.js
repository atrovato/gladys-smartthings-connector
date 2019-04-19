const apiUtils = require('../api/util.js');

module.exports = function (evt, response) {
  response.json({ statusCode: 200, installData: {} });
  return apiUtils.updateDevices(evt.installData, []);
};
