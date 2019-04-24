const Promise = require('bluebird');

const shared = require('../../shared.js');
const capabilities = require('../../api/capabilities.js');

module.exports = (deviceCommandsEvent) => {
  const deviceId = deviceCommandsEvent.externalId.replace(shared.externalIdPrefix, '');

  // Load all device types related to the device
  return gladys.deviceType.getByDevice({ id: deviceId })
    .then((deviceTypes) => {
      const capabilityByName = capabilities.capabilityByName;
      
      // Loop on each capabil
      return Promise.map(deviceCommandsEvent.commands, (command) => {
        const capability = capabilityByName.get(command.capability);

        if (capability) {
          // Find the relative device type
          const relativeDeviceTypes = deviceTypes.filter((type) => {
            return capability.identifiers.includes(type.identifier);
          });

          const capabilityCommands = capability.commands.filter((c) => {
            return c.name === command.command;
          });

          return Promise.map(capabilityCommands, (capabilityCommand) => {
            return Promise.map(relativeDeviceTypes, (relativeDeviceType) => {
              return capabilities.getGladysValue(capabilityCommand, command, relativeDeviceType)
                .then((value) => {
                  const gladysEvent = {
                    devicetype: relativeDeviceType.id,
                    value: value
                  };

                  return gladys.deviceType.exec(gladysEvent);
                });
            });
          }, { concurrency: 1 });
        } else {
          return Promise.reject(`Capability ${command.capability} not managed yet`);
        }
      }, { concurrency: 1 });
    });
};