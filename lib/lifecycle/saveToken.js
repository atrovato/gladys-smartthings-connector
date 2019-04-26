const shared = require('../shared.js');

module.exports = (token) => {
  return gladys.module.get()
    .then(modules => {
      for (let m of modules) {
        if (m.slug === 'smartthings-connector') {
          return Promise.resolve(m.id);
        }
      }

      return Promise.reject('Gladys module not found');
    }).then((moduleId) => {
      const param = {
        name: shared.smtAppTokenParam,
        value: token,
        description: 'SMT App token',
        module: moduleId
      };
      return gladys.param.setValue(param);
    });
};