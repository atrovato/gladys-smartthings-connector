const apiUtil = require('./util.js');

/**
 * SmartThings device profiles API implementation.
 */
module.exports = {

  /**
   * Get all device profiles.
   * 
   * @returns {Object} All device profiles.
   */
  list: () => {
    return apiUtil.send('/deviceprofiles', 'GET')
      .then((deviceProfiles) => {
        const items = deviceProfiles.items.filter((item) => {
          return item.metadata && item.metadata.createdBy === 'gladys';
        });
        return Promise.resolve(items);
      });
  },

  /**
   * Create a device profile.
   * 
   * @param {string[]} profile Profile to create.
   * @returns {Object} Create device profile.
   */
  create: (profile) => {
    return apiUtil.send('/deviceprofiles', 'POST', profile);
  },

  /**
   * Delete a device profile.
   * 
   * @param {string} deviceProfileId Device profile id.
   */
  delete: (deviceProfileId) => {
    return apiUtil.send('/deviceprofiles/' + deviceProfileId, 'DELETE');
  }
};