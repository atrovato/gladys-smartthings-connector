const Promise = require('bluebird');

const execCommand = require('../sync/command/execCommand.js');

/**
 * Handles event lifecycle.
 * 
 * @param {Object} evt Event data.
 */
module.exports = (evt) => {
  return Promise.map(evt.eventData.events, (event) => {
    if (event.eventType === 'DEVICE_COMMANDS_EVENT') {
      return execCommand(event.deviceCommandsEvent)
        .catch((e) => {
          console.error('SmartThings Connector : Command event error ->', e);
        });
    }
  }, { concurrency: 1 }).then(() => {
    return Promise.resolve({ eventData: {} });
  });
};