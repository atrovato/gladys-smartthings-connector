const Promise = require('bluebird');

module.exports = function (evt, response) {
  let chal = evt.pingData.challenge;
  response.json({ statusCode: 200, pingData: { challenge: chal } });
  return Promise.resolve();
};