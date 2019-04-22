const apiUtil = require('./util.js');

/**
 * SmartThings locations API implementation.
 */
module.exports = {

  /**
   * Get all locations.
   * 
   * @returns {Object} All locations.
   */
  list: () => {
    return apiUtil.send('/locations', 'GET')
      .then((locations) => {
        return Promise.resolve(locations.items);
      });
  },

  /**
   * Create a SmartThings location.
   * 
   * @param {Object} location Location to create.
   * 
   * @return {Object} The created location.
   */
  create: (location) => {
    return apiUtil.send('/locations', 'POST', location);
  }
};