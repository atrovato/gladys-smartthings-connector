const Promise = require('bluebird');

module.exports = function (evt) {
  return Promise.reject(`Lifecycle ${evt.lifecycle} not supported`);
};