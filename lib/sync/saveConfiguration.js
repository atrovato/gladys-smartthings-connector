const Promise = require('bluebird');

const status = require('../status.js');
const shared = require('../shared.js');

module.exports = (params) => {
  status.progress(status.step.config.save);

  const paramMap = [
    {
      name: shared.tokenParam,
      value: params.authToken,
      moduleId: params.moduleId,
      description: 'SmartThings authorization key'
    },
    {
      name: shared.targetUrlParam,
      value: params.targetUrl,
      moduleId: params.moduleId,
      description: 'Gladys public URL'
    }
  ];

  return Promise.map(paramMap, (param) => {
    return gladys.param.setValue(param);
  }).then(() => {
    status.done(status.step.config.save);
    return Promise.resolve();
  }).catch((e) => {
    status.fail(status.step.config.save);
    return Promise.reject(e);
  });
};