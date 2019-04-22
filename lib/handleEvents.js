const smtToken = '24ad460f-72bc-47b3-823e-4379cefaba51';
const st = require('./api/smartthingsAPI.js');
const util = require('./api/util.js');

module.exports = function () {
  gladys.on('devicestate-new', (state) => {
    console.log('devicestate-new', state);
    const deviceTypeId = state.devicetype;
    // Gets the device type (with it's device)
    if (deviceTypeId !== 4) {
      gladys.deviceType.getById({ id: deviceTypeId })
        .then((deviceType) => {
          return st.listDevices(smtToken)
            .then((smtDevices) => {
              const externalId = util.generateExternalId(deviceType.device.id);
              smtDevices = smtDevices.filter((d) => {
                return (d.app && d.app.externalId === externalId);
              });

              console.log('smtDevices', smtDevices);
            });
        }).catch((e) => {
          console.error('SmartThings Connector : Event handler error ->', e);
        });
    }
  });
};