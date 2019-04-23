const Promise = require('bluebird');

/**
 * List of managed capabitilities and links with Gladys devices.
 */
const capabilities = [
  {
    name: 'colorControl',
    identifiers: ['color'],
    attributes: [
      { name: 'color', type: 'COLOR_MAP' },
      { name: 'hue', type: 'NUMBER', min: 0, max: 100 },
      { name: 'saturation', type: 'NUMBER', min: 0, max: 100 }
    ],
    commands: [
      { name: 'setColor', type: 'COLOR_MAP' },
      { name: 'setHue', type: 'NUMBER', min: 0, max: 100 },
      { name: 'setSaturation', type: 'NUMBER', min: 0, max: 100 }
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
      { name: 'colorTemperature', type: 'NUMBER' }
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
      return Promise.resolve(this.convertHSL(argument.hue, argument.saturation, 50));
    default:
      return Promise.reject(`Impossible to compute value for command ${capabilityCommand.type} not managed`);
    }
  },
  convertHSL: function (h, s, l) {
    h /= 360;
    s /= 100;
    l /= 100;
    let r, g, b;

    if (s === 0) {
      r = g = b = l; // achromatic
    } else {
      const hue2rgb = (p, q, t) => {
        if (t < 0) {
          t += 1;
        }
        if (t > 1) {
          t -= 1;
        }
        if (t < 1 / 6) {
          return p + (q - p) * 6 * t;
        }
        if (t < 1 / 2) {
          return q;
        }
        if (t < 2 / 3) {
          return p + (q - p) * (2 / 3 - t) * 6;
        }
        return p;
      };
      const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
      const p = 2 * l - q;
      r = hue2rgb(p, q, h + 1 / 3);
      g = hue2rgb(p, q, h);
      b = hue2rgb(p, q, h - 1 / 3);
    }

    const toHex = x => {
      const hex = Math.round(x * 255).toString(16);
      return hex.length === 1 ? '0' + hex : hex;
    };
    return parseInt(`${toHex(r)}${toHex(g)}${toHex(b)}`, 16);
  }
};