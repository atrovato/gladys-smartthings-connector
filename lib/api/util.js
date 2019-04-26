const Promise = require('bluebird');
const shared = require('../shared.js');

const rp = require('request-promise');
const util = require('../util.js');

/**
 * Utility methods
 */
module.exports = {

  /**
   * Send a request to SmartThings.
   * 
   * @param {string} url The requested URL. 
   * @param {string} method HTTP method. 
   * @param {Object} body POST body. 
   * 
   * @returns {Object} The request response.
   */
  send: (url, method, body, token) => {
    return Promise.resolve()
      .then(() => {
        if (token) {
          return Promise.resolve(token);
        } else {
          return util.getAuthToken();
        }
      }).then((token) => {
        const reqOptions = {
          url: shared.smtURL + url,
          method: method,
          json: true,
          headers: {
            'Content-Type': 'application/json; charset=utf-8',
            'Authorization': 'Bearer ' + token
          }
        };

        if (body) {
          reqOptions.body = body;
        }

        return rp(reqOptions);
      });
  }
};
