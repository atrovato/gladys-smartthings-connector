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
      .catch(() => {
        return Promise.reject('Gladys external URL not stored');
      });
  },

  /**
   * Gets the SmartThings App ID from Gladys params.
   * 
   * @returns {string} SmartThings App ID.
   */
  getSmartThingsAppId: function () {
    return gladys.param.getValue(shared.smtAppIdParam)
      .catch(() => {
        return Promise.reject('SmartThings App Id not stored');
      });
  },

  /**
   * Gets the SmartThings locations with Gladys houses map from Gladys params.
   * 
   * @returns {string} Location links.
   */
  getLocationLinks: function () {
    return gladys.param.getValue(shared.smtLocationLinkParam)
      .then((links) => {
        return Promise.resolve(JSON.parse(links));
      }).catch(() => {
        return Promise.reject('Location links not stored');
      });
  },

  /**
   * Gets the last SmartThings App Auth token from Gladys params.
   * 
   * @returns {string} Location links.
   */
  getSmartThingsAppToken: function () {
    return gladys.param.getValue(shared.smtAppTokenParam)
      .catch(() => {
        return Promise.reject('SmartThings App Auth token not stored');
      });
  }
};