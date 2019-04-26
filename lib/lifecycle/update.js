const Promise = require('bluebird');

const installOrUpdate = require('./installOrUpdate.js');

module.exports = function (evt) {
  let updateData = evt.updateData;

  return installOrUpdate(updateData)
    .then(() => {
      return Promise.resolve({ updateData: {} });
    });
};