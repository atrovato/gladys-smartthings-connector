const Promise = require('bluebird');

const smtAPIDeviceProfiles = require('../../api/deviceProfiles.js');

module.exports = (profileMap) => {
  return smtAPIDeviceProfiles.list()
    .then((existingProfiles) => {
      const creationMap = new Map();
      let nbCreated = 0;
      let nbDeleted = 0;

      profileMap.forEach((value, key) => {
        creationMap.set(key, value);
      });

      existingProfiles.forEach((profile) => {
        const glagysProfile = profileMap.get(profile.name);

        if (glagysProfile) {
          profileMap.set(profile.name, profile);
          creationMap.delete(profile.name);
        } else {
          smtAPIDeviceProfiles.delete(profile.id)
            .then(() => {
              nbDeleted++;
            }).catch(function (err) {
              console.error('SmartThings Connector : Profile delete error ->', err);
            });
        }
      });
      console.log(`SmartThings Connector: ${nbDeleted} deleted profiles`);

      // Profile in Gladys but not SmartThings, create it
      return Promise.map(creationMap, (creationEntry) => {
        const gladysProfile = creationEntry[1];

        return smtAPIDeviceProfiles.create(gladysProfile)
          .then((profile) => {
            profileMap.set(profile.name, profile);
            nbCreated++;
            return Promise.resolve(profile);
          });
      }).then((profiles) => {
        console.log(`SmartThings Connector: ${nbCreated} created profiles`);
        return profiles;
      });
    });
};