const Promise = require('bluebird');

const installOrUpdate = require('./installOrUpdate.js');

module.exports = (evt) => {
  let installData = evt.installData;

  return installOrUpdate(installData)
    .then(() => {
      return Promise.resolve({ installData: {} });
    });
};
