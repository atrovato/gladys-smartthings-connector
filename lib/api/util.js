const st = require('./smartthingsAPI.js');
const gladysAPI = require('./gladysAPI.js');
const deviceById = 'SELECT * FROM device WHERE device.id = ?;';
const commandUtil = require('./commandUtil.js');
const Promise = require('bluebird');
const shared = require('../shared.js');

const rp = require('request-promise');
const util = require('../util.js');

/**
 * Utility methods
 */
module.exports = {

  /**
   * Send a request to SmartThings.
   * 
   * @param {string} url The requested URL. 
   * @param {string} method HTTP method. 
   * @param {Object} body POST body. 
   * 
   * @returns {Object} The request response.
   */
  send: (url, method, body) => {
    return util.getAuthToken()
      .then((token) => {
        const reqOptions = {
          url: shared.smtURL + url,
          method: method,
          json: true,
          headers: {
            'Content-Type': 'application/json; charset=utf-8',
            'Authorization': 'Bearer ' + token
          }
        };

        if (body) {
          reqOptions.body = body;
        }

        return rp(reqOptions);
      });
  },

  generateExternalId: function (deviceId) {
    return shared.externalIdPrefix + deviceId;
  },
  /**
     * Compares device lists from Gladys and SmartThings, creating and deleting devices as necessary
     *
     * @param token SmartThings access token
     * @param locationId SmartThings location ID
     * @param gladysDevices List of devices from LIFX
     * @param smartThingsDevices List of devices from SmartThings
     */
  reconcileDeviceLists: function (token, locationId, installedAppId, gladysDevices, smartThingsDevices) {
    console.log('locationId', locationId);
    console.log('installedAppId', installedAppId);

    const creationMap = new Map();
    const deletionMap = new Map();

    // Fill creation map with exising devices
    gladysDevices.forEach((gladysDevice) => {
      const gladysExternalId = this.generateExternalId(gladysDevice.id);
      gladysDevice.externalId = gladysExternalId;
      creationMap.set(gladysExternalId, gladysDevice);
    });

    // Fill or remove the deletion or creation map
    smartThingsDevices.forEach(function (smtDevice) {
      const smtExternalId = smtDevice.app.externalId;

      // Do not create if already exists
      if (!creationMap.delete(smtExternalId)) {
        // Do not keep if not exists
        deletionMap.set(smtExternalId, smtDevice);
      }
    });

    // Device in Gladys but not SmartThings, create it
    creationMap.forEach((gladysDevice) => {
      let map = {
        label: gladysDevice.name,
        profileId: 'ce5e3122-cd34-42b5-8b22-55c7b1bd0f03', // TODO check exisitng profiles
        locationId: locationId,
        installedAppId: installedAppId,
        externalId: gladysDevice.externalId
      };

      st.createDevice(token, map)
        .catch(function (err) {
          console.error('SmartThings Connector : Device create error ->', err);
        });
    });

    // Device in SmartThings but not Gladys, delete it
    deletionMap.forEach(function (smtDevice) {
      st.deleteDevice(token, smtDevice.deviceId)
        .catch(function (err) {
          console.error('SmartThings Connector : Device delete error ->', err);
        });
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
    return gladys.utils.sqlUnique(deviceById, [deviceCommandsEvent.externalId.replace(shared.externalIdPrefix, '')])
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
