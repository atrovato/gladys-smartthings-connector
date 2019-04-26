const Promise = require('bluebird');

const capabilities = require('../../api/capabilities.js');
const smtAPIDevices = require('../../api/devices.js');
const smtAPIOAuth = require('../../api/oauth.js');
const shared = require('../../shared.js');

module.exports = () => {
  gladys.on('devicestate-new', (state) => {
    return smtAPIOAuth.getAccessToken()
      .then((token) => {

        // Load device type
        return gladys.deviceType.getById({ id: state.devicetype })
          .then((deviceType) => {
            const capability = capabilities.capabilityByIdentifier.get(deviceType.identifier);

            if (capability) {
              return capabilities.getSmartThingsValues(capability, state.value, deviceType)
                .then((values) => {

                  if (values.length > 0) {
                    return smtAPIDevices.list(undefined, true)
                      .then((devices) => {
                        const filtered = devices.filter((device) => {
                          return device.app.externalId === shared.externalIdPrefix + deviceType.device;
                        });

                        return Promise.map(filtered, (device) => {
                          console.log(`SmartThings Connector : Send '${device.label}' as '${capability.name}' device event to SmartThings`);

                          return smtAPIDevices.createEvents(device.deviceId, values, token)
                            .catch((e) => {
                              return Promise.reject(`Send event to SmartThings failed with ${deviceType.identifier} (id=${deviceType.id}) -> ${e.message}`);
                            });
                        });
                      });
                  }
                });
            }
          });
      }).catch((e) => {
        console.error('SmartThings Connector : Handle new device state error ->', e);
      });
  });
};