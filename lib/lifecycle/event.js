const Promise = require('bluebird');

const execCommand = require('../sync/command/execCommand.js');
const oauth = require('../api/oauth.js');

/**
 * Handles event lifecycle.
 * 
 * @param {Object} evt Event data.
 */
module.exports = (evt) => {
  return oauth.storeRefreshToken(evt.eventData)
    .then(() => {
      return Promise.map(evt.eventData.events, (event) => {
        if (event.eventType === 'DEVICE_COMMANDS_EVENT') {
          return execCommand(event.deviceCommandsEvent)
            .catch((e) => {
              console.error('SmartThings Connector : Command event error ->', e);
            });
        } else {
          console.error('Event not managed :', JSON.stringify(event));
        }
      }, { concurrency: 1 });
    }).then(() => {
      return Promise.resolve({ eventData: {} });
    });
};