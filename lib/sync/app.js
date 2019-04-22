const Promise = require('bluebird');

const smtAPIApp = require('../api/apps.js');
const util = require('../util.js');
const status = require('../status.js');
const shared = require('../shared.js');

const appName = 'gladys-automation';
const displayName = 'Gladys Connector';
const description = 'Link SmartThings with Gladys';

/**
 * Check and create SmartThings Gladys app.
 */
module.exports = (params) => {
  // First check if SMT Gladys APP exists
  status.progress(status.step.app.check);
  return Promise.resolve()
    .then(() => {
      return smtAPIApp.get(appName)
        .then(() => {
          return util.getTargetURL().then((targetUrl) => {
            return smtAPIApp.update(appName, displayName, description, targetUrl);
          });
        }).then((app) => {
          status.done(status.step.app.check);
          return Promise.resolve(app);
        }).catch((e) => {
          if (e && e.statusCode === 403) {
            return util.getTargetURL().then((targetUrl) => {
              // If APP does not exist, create it
              status.progress(status.step.app.create);
              return smtAPIApp.create(appName, displayName, description, targetUrl)
                .then((res) => {
                  status.done(status.step.app.create);
                  return Promise.resolve(res);
                }).catch((e) => {
                  status.fail(status.step.app.create);
                  return Promise.reject(e);
                });
            });
          } else {
            status.fail(status.step.app.check);
            return Promise.reject(e);
          }
        });
    }).then((app) => {
      return gladys.param.setValue({
        name: shared.smtAppIdParam,
        value: app.appId,
        module: params.moduleId,
        description: 'SmartThings App ID'
      }).then(() => {
        return gladys.param.setValue({
          name: shared.smtPublicKeyParam,
          value: app.webhookSmartApp.publicKey,
          module: params.moduleId,
          description: 'SmartThings Public Key'
        });
      }).then(() => {
        return Promise.resolve(app);
      });
    });
};