const Promise = require('bluebird');

const convertHSL = require('../utils/convertHSL.js');

/**
 * List of managed capabitilities and links with Gladys devices.
 */
const capabilities = [
  {
    name: 'colorControl',
    identifiers: ['color'],
    attributes: [
      // { name: 'hue', type: 'NUMBER', min: 0, max: 100 },
      // { name: 'saturation', type: 'NUMBER', min: 0, max: 100 },
      { name: 'color', type: 'COLOR_MAP' }
    ],
    commands: [
      // { name: 'setHue', type: 'NUMBER', min: 0, max: 100 },
      // { name: 'setSaturation', type: 'NUMBER', min: 0, max: 100 },
      { name: 'setColor', type: 'COLOR_MAP' }
    ]
  },
  {
    name: 'switch',
    identifiers: ['switch'],
    attributes: [
      {
        name: 'switch', type: 'ENUM', values: [
          { value: 'on', mapWith: 1 },
          { value: 'off', mapWith: 0 }
        ]
      }
    ],
    commands: [
      { name: 'on', type: 'VALUE', value: 1 },
      { name: 'off', type: 'VALUE', value: 0 }
    ]
  },
  {
    name: 'colorTemperature',
    identifiers: ['white_temperature'],
    attributes: [
      { name: 'colorTemperature', type: 'NUMBER', function: (x) => 100 - x }
    ],
    commands: [
      { name: 'setColorTemperature', type: 'NUMBER', function: (x) => 100 - x }
    ]
  },
  {
    name: 'switchLevel',
    identifiers: ['white_brightness', 'brightness'],
    attributes: [
      { name: 'level', type: 'NUMBER', min: 0, max: 100 }
    ],
    commands: [
      { name: 'setLevel', type: 'NUMBER', min: 0, max: 100 }
    ]
  },
  {
    name: 'temperatureMeasurement',
    identifiers: ['temperature'],
    attributes: [
      { name: 'temperature', type: 'NUMBER' }
    ]
  },
  {
    name: 'presenceSensor',
    identifiers: ['presenceSensor'],
    attributes: [
      {
        name: 'presence', type: 'ENUM', values: [
          { value: 'not present', mapWith: 0 },
          { value: 'present', mapWith: 1 }
        ]
      }
    ]
  },
  {
    name: 'illuminanceMeasurement',
    identifiers: ['luminence'],
    attributes: [
      { name: 'illuminance', type: 'NUMBER' }
    ]
  }
];

module.exports = {
  capabilities: capabilities,
  capabilityByName: capabilities.reduce(function (map, capability) {
    map.set(capability.name, capability);
    return map;
  }, new Map()),
  capabilityByIdentifier: capabilities.reduce(function (map, capability) {
    capability.identifiers.forEach((identifier) => {
      map.set(identifier, capability);
    });
    return map;
  }, new Map()),
  getGladysValue: (capabilityCommand, command) => {
    switch (capabilityCommand.type) {
    case 'NUMBER':
      let value = command.arguments[0];
      if (capabilityCommand.function) {
        value = capabilityCommand.function(value);
      }
      return Promise.resolve(value);
    case 'VALUE':
      return Promise.resolve(capabilityCommand.value);
    case 'COLOR_MAP':
      const argument = command.arguments[0];
      return Promise.resolve(convertHSL(argument.hue, argument.saturation, 50));
    default:
      return Promise.reject(`Impossible to compute value for command ${capabilityCommand.type} not managed`);
    }
  },
  getSmartThingsValues: (capability, value) => {
    return Promise.map(capability.attributes, (attribute) => {
      let converted;
      switch (attribute.type) {
      case 'NUMBER':
        converted = value;
        if (attribute.function) {
          converted = attribute.function(value);
        }
        break;
      case 'ENUM':
        attribute.values.forEach((v) => {
          if (v.mapWith === value) {
            converted = v.value;
          }
        });
        break;
      case 'COLOR_MAP':
      default:
      }

      if (converted !== undefined && converted !== null) {
        return Promise.resolve({
          component: 'main',
          capability: capability.name,
          attribute: attribute.name,
          value: converted
        });
      }
    });
  }
};