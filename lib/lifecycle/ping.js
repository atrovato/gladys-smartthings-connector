const Promise = require('bluebird');

module.exports = function (evt) {
  return Promise.resolve({pingData: { challenge: evt.pingData.challenge }});
};