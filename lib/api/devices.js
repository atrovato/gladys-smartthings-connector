const apiUtil = require('./util.js');
const shared = require('../shared.js');

const cache = {};

/**
 * SmartThings device profiles API implementation.
 */
module.exports = {

  /**
   * Get all devices.
   * 
   * @returns {Object} All devices.
   */
  list: (token, useCache = false) => {
    if (useCache && cache.list) {
      return Promise.resolve(cache.list);
    } else {
      return apiUtil.send('/devices', 'GET', undefined, token)
        .then((deviceProfiles) => {
          const items = deviceProfiles.items.filter((item) => {
            return item.app && item.app.externalId && item.app.externalId.startsWith(shared.externalIdPrefix);
          });

          cache.list = items;
          return Promise.resolve(items);
        });
    }
  },

  /**
   * Create a device.
   * 
   * @param {Object} device SmartThings device.
   * @returns {Object} Create device.
   */
  create: (device, token) => {
    return apiUtil.send('/devices', 'POST', device, token);
  },

  /**
   * Delete a device.
   * 
   * @param {string} deviceId Device id.
   */
  delete: (deviceId, token) => {
    return apiUtil.send('/devices/' + deviceId, 'DELETE', undefined, token);
  },

  createEvents: (deviceId, events, token) => {
    const body = {
      deviceEvents: events
    };
    return apiUtil.send('/devices/' + deviceId + '/events', 'POST', body, token);
  }
};