const rp = require('request-promise');
const shared = require('../shared.js');
const apiEndpoint = shared.smtURL;

/**
 * SmartThings API calls used by this application
 */
module.exports = {

  /**
     * Create a device. The params argument is an object with the following properties:
     *
     * profileId:      ID of the device profile (created outside of this app)
     * locationId:     ID of the location into which the device should be placed
     * installedAppId: ID of the installed instance of this C2C connect endpoint app
     */
  createDevice(token, params) {
    let body = {
      label: params.label,
      locationId: params.locationId,
      app: {
        profileId: params.profileId,
        installedAppId: params.installedAppId,
        externalId: params.externalId
      }
    };
    let uri = apiEndpoint + '/devices';
    let options = {
      method: 'POST',
      uri: uri,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + token
      },
      body: JSON.stringify(body),
      transform: function (body) {
        return JSON.parse(body);
      }
    };
    return rp(options);
  },

  /**
     * Deletes the specified device
     */
  deleteDevice(token, deviceId) {
    let uri = apiEndpoint + '/devices/' + deviceId;
    let options = {
      method: 'DELETE',
      uri: uri,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + token
      }
    };
    return rp(options);
  },

  /**
     * Creates one or more events for the specified device. The 'events' argument is an array of objects, each of
     * which has the following properties:
     *
     * component: Name of the component. Should be set to 'main' for a device with only one component
     * capability: Name of the capability in camel-case form, e.g. 'switchLevel'
     * attribute: Name of the event attribute, e.g. 'level'
     * value: Value of the event attribute
     * unit: (optional), unit of measure of the attribute, e.g. 'F' or 'C' for a temperature
     */
  sendEvents(token, deviceId, events) {
    let uri = apiEndpoint + '/devices/' + deviceId + '/events';
    let options = {
      method: 'POST',
      uri: uri,
      headers: {
        'Content-Type': 'application/json; charset=utf-8',
        'Authorization': 'Bearer ' + token
      },
      body: JSON.stringify(events)
    };
    return rp(options);
  },


  /**
     * Returns a list of child devices of the specified connector app instance
     *
     * @param token
     * @param locationId
     * @param installedSmartAppId
     * @returns {*}
     */
  listDevices(token, locationId, installedSmartAppId) {
    let isa = installedSmartAppId;
    let url = apiEndpoint + '/devices?locationId=' + locationId;
    let opts = {
      url: url,
      method: 'GET',
      json: true,
      headers: {
        'Content-Type': 'application/json; charset=utf-8',
        'Authorization': 'Bearer ' + token
      },
      transform: function (body) {
        let result = [];
        let data = body; //JSON.parse(body)
        if (data.items) {
          for (let i = 0; i < data.items.length; i++) {
            let it = data.items[i];
            if (it.app) {
              if (it.app.installedAppId == isa) {
                result.push(it);
              }
            }
          }
        }
        return result;
      }
    };
    return rp(opts);
  },

  /**
     * Returns a list of child profiles of the specified connector app instance
     *
     * @param token
     * @param locationId
     * @param installedSmartAppId
     * @returns {*}
     */
  listProfiles(token) {
    let url = apiEndpoint + '/deviceprofiles';
    let opts = {
      url: url,
      method: 'GET',
      json: true,
      headers: {
        'Content-Type': 'application/json; charset=utf-8',
        'Authorization': 'Bearer ' + token
      },
      transform: function (body) {
        let result = [];
        let data = body; //JSON.parse(body)
        if (data.items) {
          for (let i = 0; i < data.items.length; i++) {
            let it = data.items[i];
            result.push(it);
          }
        }
        return result;
      }
    };
    return rp(opts);
  }
};
