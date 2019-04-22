const Promise = require('bluebird');

const status = require('../status.js');
const shared = require('../shared.js');

/**
 * Save the SmartThings location links in Gladys parameters.
 */
module.exports = (houses, moduleId) => {
  status.progress(status.step.location.save);
  const links = {};
  let containsData = false;

  houses.forEach((house) => {
    if (house.locationId && house.locationId !== 'none') {
      links[house.id] = house.locationId;
      containsData = true;
    }
  });

  if (containsData) {
    const param = {
      name: shared.smtLocationLinkParam,
      value: JSON.stringify(links),
      module: moduleId,
      description: 'Links between Gladys houses and SMT locations'
    };
    return gladys.param.setValue(param)
      .then(() => {
        status.done(status.step.location.save);
        return Promise.resolve(houses);
      }).catch((e) => {
        status.fail(status.step.location.save);
        return Promise.reject(e);
      });
  } else {
    status.done(status.step.location.save);
    return Promise.resolve(houses);
  }
};