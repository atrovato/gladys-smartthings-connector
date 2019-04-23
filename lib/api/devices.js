const apiUtil = require('./util.js');
const shared = require('../shared.js');

/**
 * SmartThings device profiles API implementation.
 */
module.exports = {

  /**
   * Get all devices.
   * 
   * @returns {Object} All devices.
   */
  list: (token) => {
    return apiUtil.send('/devices', 'GET', undefined, token)
      .then((deviceProfiles) => {
        const items = deviceProfiles.items.filter((item) => {
          return item.app && item.app.externalId && item.app.externalId.startsWith(shared.externalIdPrefix);
        });

        return Promise.resolve(items);
      });
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
  }
};