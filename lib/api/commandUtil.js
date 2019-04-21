const Promise = require('bluebird');

module.exports = {
  createGladysEvent: function (deviceTypes, command) {
    let expectedDeviceIdentifier;
    let value;

    switch (command.capability) {
    case 'switchLevel':
      expectedDeviceIdentifier = 'white_brightness';
      value = command.arguments[0];
      break;
    case 'colorTemperature':
      expectedDeviceIdentifier = 'white_temperature';
      value = 100 - command.arguments[0];
      break;
    case 'colorControl':
      expectedDeviceIdentifier = 'color';
      value = this.convertHSL(command.arguments[0].hue, command.arguments[0].saturation, 50);
      break;
    case 'switch':
      expectedDeviceIdentifier = command.capability;
      value = command.command === 'on' ? 1 : 0;
      break;
    default:
      return Promise.reject('Unknow command type ' + command.capability + ' (value=' + command.command + ')');
    }

    const filteredDeviceTypes = deviceTypes.filter((type) => {
      return type.identifier === expectedDeviceIdentifier;
    });

    switch (filteredDeviceTypes.length) {
    case 0:
      return Promise.reject('No device found for capability ' + command.capability + ' (value=' + command.command + ')');
    case 1:
      return Promise.resolve({ devicetype: filteredDeviceTypes[0].id, value: parseInt(value) });
    default:
      return Promise.reject('Too many devices found for capability ' + command.command);
    }
  },
  createSmartThingsEvent: function (command) {
    let result = [];

    switch (command.capability) {
    case 'switchLevel':
      result.push({
        component: 'main',
        capability: 'switch',
        attribute: 'switch',
        value: 'on'
      });
      result.push({
        component: command.componentId,
        capability: command.capability,
        attribute: 'level',
        value: command.arguments[0]
      });
      break;
    case 'colorTemperature':
      result.push({
        component: 'main',
        capability: 'switch',
        attribute: 'switch',
        value: 'on'
      });
      result.push({
        component: command.componentId,
        capability: command.capability,
        attribute: command.capability,
        value: Math.max(command.arguments[0], 1)
      });
      break;
    case 'colorControl':
      result.push({
        component: 'main',
        capability: 'switch',
        attribute: 'switch',
        value: 'on'
      });
      result.push({
        component: command.componentId,
        capability: command.capability,
        attribute: 'hue',
        value: command.arguments[0].hue
      });
      result.push({
        component: command.componentId,
        capability: command.capability,
        attribute: 'saturation',
        value: command.arguments[0].saturation
      });
      break;
    default:
      result.push({
        component: command.componentId,
        capability: command.capability,
        attribute: command.capability,
        value: command.command
      });
    }

    return Promise.resolve(result);
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

