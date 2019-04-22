const Promise = require('bluebird');

const util = require('../util.js');
const status = require('../status.js');

module.exports = () => {
  const result = {
    configured: true
  };
  status.progress(status.step.config.load);
  return Promise.resolve()
    .then(() => {
      return util.getAuthToken()
        .then((authToken) => {
          result.authToken = authToken;
          return Promise.resolve();
        }).catch((e) => {
          result.configured = false;
          return Promise.resolve(e);
        });
    }).then(() => {
      return util.getTargetURL()
        .then((targetUrl) => {
          result.targetUrl = targetUrl;
          return Promise.resolve();
        }).catch((e) => {
          result.configured = false;
          return Promise.resolve(e);
        });
    }).then(() => {
      status.done(status.step.config.load);
      return Promise.resolve(result);
    }).catch((e) => {
      status.fail(status.step.config.load);
      return Promise.reject(e);
    });
};