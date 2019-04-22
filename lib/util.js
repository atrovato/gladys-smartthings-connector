const Promise = require('bluebird');
const shared = require('./shared.js');

module.exports = {

  /**
   * Gets the stored authorization token form Gladys params.
   * 
   * @returns {string} SmartThings auth token.
   */
  getAuthToken: function () {
    return gladys.param.getValue(shared.tokenParam)
      .catch(() => {
        return Promise.reject('SmartThings authorization token not stored');
      });
  },

  /**
   * Gets the Gladys instance external accessible URL form Gladys params.
   * 
   * @returns {string} external URL.
   */
  getTargetURL: function () {
    return gladys.param.getValue(shared.targetUrlParam)
      .then((url) => {
        return Promise.resolve(url);
      }).catch(() => {
        return Promise.reject('Gladys external URL not stored');
      });
  }
};