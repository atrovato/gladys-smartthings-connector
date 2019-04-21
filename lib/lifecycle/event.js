const Promise = require('bluebird');
const utilAPI = require('../api/util.js');

module.exports = function (evt) {
  return Promise.each(evt.eventData.events, (event) => {
    if (event.eventType === 'DEVICE_COMMANDS_EVENT') {
      return utilAPI.executeCommand(evt.eventData.authToken, event.deviceCommandsEvent);
    } else {
      return Promise.reject('Not managed event type', event.eventType);
    }
  }).then(() => {
    return Promise.resolve({ eventData: {} });
  }).catch((e) => {
    return Promise.reject(e);
  });
};