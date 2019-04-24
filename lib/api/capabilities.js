const Promise = require('bluebird');

const convertHSL = require('../utils/convertHSLtoDecimal.js');
const convertDecimal = require('../utils/convertDecimaltoHSL.js');

const revertValue = (value, deviceType) => {
  return Math.max(1, 100 - (value / 100 * deviceType.max));
};

const percentValue = (value, deviceType) => {
  return Math.max(1, value / 100 * deviceType.max);
};

const fromPercentValue = (value, deviceType) => {
  return value * 100 / deviceType.max;
};

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
      { name: 'colorTemperature', type: 'NUMBER', function: revertValue }
    ],
    commands: [
      { name: 'setColorTemperature', type: 'NUMBER', function: revertValue }
    ]
  },
  {
    name: 'switchLevel',
    identifiers: ['white_brightness', 'brightness'],
    attributes: [
      { name: 'level', type: 'NUMBER', function: percentValue }
    ],
    commands: [
      { name: 'setLevel', type: 'NUMBER', function: fromPercentValue }
    ]
  },
  {
    name: 'temperatureMeasurement',
    identifiers: ['temperature'],
    attributes: [
      { name: 'temperature', type: 'NUMBER', min: -450, max: 10000, unit: ['F', 'C'] }
    ]
  },
  {
    name: 'motionSensor',
    identifiers: ['presence'],
    attributes: [
      {
        name: 'presence', type: 'ENUM', values: [
          { value: 'inactive', mapWith: 0 },
          { value: 'active', mapWith: 1 }
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
  getGladysValue: (capabilityCommand, command, deviceType) => {
    let convertedValue;
    switch (capabilityCommand.type) {
    case 'NUMBER':
      convertedValue = command.arguments[0];
      if (capabilityCommand.function) {
        convertedValue = capabilityCommand.function(convertedValue, deviceType);
      }
      break;
    case 'VALUE':
      convertedValue = capabilityCommand.value;
      break;
    case 'COLOR_MAP':
      const argument = command.arguments[0];
      convertedValue = convertHSL(argument.hue, argument.saturation, 50);
      break;
    default:
      return Promise.reject(`Impossible to compute value for command ${capabilityCommand.type} not managed`);
    }
  
    return Promise.resolve(parseFloat(convertedValue));
  },
  getSmartThingsValues: (capability, value, deviceType) => {
    return Promise.map(capability.attributes, (attribute) => {
      let converted;
      switch (attribute.type) {
      case 'NUMBER':
        converted = value;
        if (attribute.function) {
          converted = attribute.function(value, deviceType);
        }
        if (attribute.hasOwnProperty('min')) {
          converted = Math.max(attribute.min, converted);
        }
        if (attribute.hasOwnProperty('max')) {
          converted = Math.min(attribute.max, converted);
        }
        converted = Math.round(converted);
        break;
      case 'ENUM':
        attribute.values.forEach((v) => {
          if (v.mapWith === value) {
            converted = v.value;
          }
        });
        break;
      case 'COLOR_MAP':
        const hsl = convertDecimal(value);
        converted = JSON.stringify({ hue: hsl[0], saturation: hsl[1] });
      default:
      }

      if (converted !== undefined && converted !== null) {
        const result = {
          component: 'main',
          capability: capability.name,
          attribute: attribute.name,
          value: converted
        };

        const unit = deviceType.unit;
        if (attribute.unit && unit && unit.length !== '') {
          attribute.unit.forEach((u) => {
            if (unit.includes(u)) {
              result.unit = u;
            }
          });
        }

        return Promise.resolve(result);
      }
    });
  }
};