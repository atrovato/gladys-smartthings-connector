const Promise = require('bluebird');

const util = require('../../util.js');
const shared = require('../../shared.js');

module.exports = (installedAppId, gladysDevices, profileByDeviceMap) => {
  return util.getLocationLinks()
    .then((links) => {
      return gladys.room.getAll()
        .then((rooms) => {
          const houseByRoom = new Map();
          rooms.forEach((room) => {
            houseByRoom.set(room.id, room.house);
          });
          return Promise.resolve(houseByRoom);
        }).then((houseByRoom) => {
          return Promise.map(gladysDevices, (device) => {
            const locationId = device.room ? links['' + houseByRoom.get(device.room.id)] : null;
            const profile = profileByDeviceMap.get(device.id);

            if (locationId && profile) {
              const smtDevice = {
                label: device.name,
                locationId: locationId,
                app: {
                  profileId: profile.id,
                  installedAppId: installedAppId,
                  externalId: shared.externalIdPrefix + device.id
                }
              };

              return Promise.resolve(smtDevice);
            }
          }).then((res) => {
            return Promise.resolve(res.filter((r) => {
              return r;
            }));
          });
        });
    });
};