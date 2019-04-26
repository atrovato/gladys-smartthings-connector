const apiUtil = require('./util.js');

/**
 * SmartThings apps API implementation.
 */
module.exports = {

  /**
   * Get a single app.
   * 
   * @param {string} appNameOrId The appName or appId field of an app.
   * 
   * @returns {Object} The requested App.
   */
  get: (appNameOrId) => {
    return apiUtil.send('/apps/' + appNameOrId, 'GET');
  },

  /**
   * Create a WebHook Smart App in SmartThings.
   * 
   * @param {string} appName A globally unique, developer-defined identifier for an app. 
   * It is alpha-numeric, may contain dashes, underscores, periods, and must be less then 250 characters long.
   * @param {string} displayName A default display name for an app.
   * @param {string} description A default description for an app.
   * @param {string} targetUrl A URL that should be invoked during execution.
   * 
   * @return {Object} The created App.
   */
  create: (appName, displayName, description, targetUrl) => {
    const body = {
      appName: appName,
      displayName: displayName,
      description: description,
      singleInstance: true,
      appType: 'WEBHOOK_SMART_APP',
      classifications: ['DEVICE', 'CONNECTED_SERVICE'],
      webhookSmartApp: {
        targetUrl: targetUrl
      }
    };

    return apiUtil.send('/apps', 'POST', body);
  },

  /**
   * Update a WebHook Smart App in SmartThings.
   * 
   * @param {string} appName A globally unique, developer-defined identifier for an app. 
   * It is alpha-numeric, may contain dashes, underscores, periods, and must be less then 250 characters long.
   * @param {string} displayName A default display name for an app.
   * @param {string} description A default description for an app.
   * @param {string} targetUrl A URL that should be invoked during execution.
   * 
   * @return {Object} The created App.
   */
  update: (appName, displayName, description, targetUrl) => {
    const body = {
      appName: appName,
      displayName: displayName,
      description: description,
      singleInstance: true,
      appType: 'WEBHOOK_SMART_APP',
      classifications: ['DEVICE', 'CONNECTED_SERVICE'],
      webhookSmartApp: {
        targetUrl: targetUrl
      }
    };

    return apiUtil.send('/apps/' + appName, 'PUT', body);
  },

  updateScope: (appNameOrId, body) => {
    return apiUtil.send('/apps/' + appNameOrId + '/oauth', 'PUT', body);
  },

  generateClientSecret: (appNameOrId, body) => {
    return apiUtil.send('/apps/' + appNameOrId + '/oauth/generate', 'POST', body);
  }
};