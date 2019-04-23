const Promise = require('bluebird');

const identifierMap = {
  'switch': 'switch',
  'color': 'colorControl',
  'white_temperature': 'colorTemperature',
  'white_brightness': 'switchLevel',
  'brightness': 'switchLevel',
  'temperature': 'temperatureMeasurement',
  'presence': 'presenceSensor',
  'luminence': 'illuminanceMeasurement'
};

module.exports = (device) => {
  return gladys.deviceType.getByDevice({ id: device.id }).then((deviceTypes) => {
    const capabilities = extractCapabilities(deviceTypes);

    if (capabilities.length > 0) {
      const expectedProfile = {
        name: capabilities.join('_'),
        components: [
          {
            id: 'main',
            capabilities: capabilities.map((c) => {
              return { id: c, version: 1 };
            })
          }
        ],
        metadata: {
          createdBy: 'gladys'
        }
      };

      return Promise.resolve(expectedProfile);
    } else {
      return Promise.reject('No profile determined');
    }
  });
};

function extractCapabilities(deviceTypes) {
  return deviceTypes.filter((deviceType) => {
    return extractIdentifier(deviceType);
  }).map((deviceType) => {
    return extractIdentifier(deviceType);
  });
}

function extractIdentifier(deviceType) {
  const identifier = deviceType.identifier.toLowerCase();
  return identifierMap[identifier];
}