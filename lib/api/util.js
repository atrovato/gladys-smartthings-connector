const st = require('./smartthingsAPI.js');
const gladysAPI = require('./gladysAPI.js');
const deviceById = 'SELECT * FROM device WHERE device.id = ?;';
const commandUtil = require('./commandUtil.js');
const Promise = require('bluebird');

/**
 * Utility methods
 */
module.exports = {

  /**
     * Compares device lists from Gladys and SmartThings, creating and deleting devices as necessary
     *
     * @param token SmartThings access token
     * @param locationId SmartThings location ID
     * @param gladysDevices List of devices from LIFX
     * @param smartThingsDevices List of devices from SmartThings
     */
  reconcileDeviceLists: function (token, locationId, installedAppId, gladysDevices, smartThingsDevices) {
    gladysDevices
      .filter((gladysDevice) => {
        return !smartThingsDevices.find((smtDevice) => {
          return smtDevice.app.externalId === gladysDevice.id;
        });
      }).forEach((gladysDevice) => {
        let map = {
          label: gladysDevice.name,
          profileId: 'ce5e3122-cd34-42b5-8b22-55c7b1bd0f03', // TODO check exisitng profiles
          locationId: locationId,
          installedAppId: installedAppId,
          externalId: gladysDevice.id
        };

        st.createDevice(token, map)
          .catch(function (err) {
            console.error('SmartThings Connector : Device create error ->', err);
          });
      });

    // Iterate over all devices in SmartThings and delete any that are missing from Gladys
    smartThingsDevices.forEach(function (smtDevice) {
      if (!gladysDevices.find(function (gladysDevice) {
        return smtDevice.app.externalId === gladysDevice.id;
      })) {

        // Device in SmartThings but not Gladys, delete it
        st.deleteDevice(token, smtDevice.deviceId)
          .catch(function (err) {
            console.error('SmartThings Connector : Device delete error ->', err);
          });
      }
    });
  },
  updateDevices: function (params, existingDevices) {
    let installedAppId = params.installedApp.installedAppId;
    let locationId = params.installedApp.locationId;

    return gladysAPI.loadDevices()
      .then((gladysDevices) => {
        this.reconcileDeviceLists(params.authToken, locationId, installedAppId, gladysDevices, existingDevices);
      });
  },
  executeCommand: function (token, deviceCommandsEvent) {
    return gladys.utils.sqlUnique(deviceById, [deviceCommandsEvent.externalId])
      .then((device) => {

        return gladys.deviceType.getByDevice(device)
          .then((deviceTypes) => {

            return Promise.each(deviceCommandsEvent.commands, (command) => {
              return commandUtil.createGladysEvent(deviceTypes, command)
                .then((gladysEvent) => {
                  return gladys.deviceType.exec(gladysEvent);
                }).then(() => {
                  return commandUtil.createSmartThingsEvent(command);
                }).then((smartthingsEvent) => {
                  st.sendEvents(token, deviceCommandsEvent.deviceId, smartthingsEvent)
                    .catch(function (err) {
                      console.error('SmartThings Connector : Device event error ->', err);
                    });

                  return Promise.resolve();
                });
            });
          });
      });
  }
};
