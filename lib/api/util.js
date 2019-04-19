const st = require('./smartthingsAPI.js');

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
    gladysDevices.forEach(function (device) {
      if (!smartThingsDevices.find(function (device) {
        return device.app.externalId == device.id;
      })) {

        let map = {
          label: device.name,
          profileId: deviceProfileId(device),
          locationId: locationId,
          installedAppId: installedAppId,
          externalId: device.id
        };

        st.createDevice(token, map)
          .catch(function (err) {
            console.error(`${err}  creating device`);
          });
      }
    });

    // Iterate over all devices in SmartThings and delete any that are missing from Gladys
    smartThingsDevices.forEach(function (device) {
      if (!gladysDevices.find(function (device) {
        return device.app.externalId == device.id;
      })) {

        // Device in SmartThings but not Gladys, delete it
        st.deleteDevice(token, device.deviceId)
          .catch(function (err) {
            console.error(`${err}  deleting device`);
          });
      }
    });
  },
  updateDevices: function (params, existingDevices) {
    let installedAppId = params.installedApp.installedAppId;
    let locationId = params.installedApp.locationId;

    return gladysAPI.loadDevices()
      .then((gladysDevices) => {
        reconcileDeviceLists(params.authToken, locationId, installedAppId, gladysDevices, existingDevices);
      });
  }
};

function deviceProfileId(device) {
  return 'ce5e3122-cd34-42b5-8b22-55c7b1bd0f03';
}