const Promise = require('bluebird');

module.exports = function (evt, response) {
  response.json({ statusCode: 200, eventData: {} });
  return Promise.reject('Lifecycle ${evt.lifecycle} not supported');
};