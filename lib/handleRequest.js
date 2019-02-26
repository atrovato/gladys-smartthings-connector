
module.exports = function handleRequest(req, response) {
  let evt = req.body;
  let lifecycle = evt.lifecycle;
  let res;

  console.log(`${lifecycle} lifecycle. Request body:`);
  console.log(evt);

  switch(lifecycle) {
  // PING happens during app creation. Purpose is to verify app
  // is alive and is who it says it is.
  case 'PING': {
    let chal = evt.pingData.challenge;
    response.json({statusCode: 200, pingData: {challenge: chal}});
    break;
  }
  // CONFIGURATION happens as user begins to install the app.
  case 'CONFIGURATION': {
    res = stConfig.handle(evt.configurationData);
    console.log('CONFIGURATION response:');
    console.log({configurationData: res});
    response.json({statusCode: 200, configurationData: res});
    break;
  }
  // INSTALL happens after a user finishes configuration, and installs the
  // app.
  case 'INSTALL': {
    let token = evt.installData.authToken;
    console.log('INSTALL', evt.installData.installedApp, token);
    response.json({statusCode: 200, installData: {}});
    break;
  }
  // UPDATE happens when a user updates the configuration of an
  // already-installed app.
  case 'UPDATE': {
    let token = evt.updateData.authToken;
    console.log('UPDATE', evt.updateData.installedApp, token);
    response.json({statusCode: 200, updateData: {}});
    break;
  }
  // UNINSTALL happens when a user uninstalls the app.
  case 'UNINSTALL': {
    response.json({statusCode: 200, uninstallData: {}});
    break;
  }
  // EVENT happens when any subscribed-to event or schedule executes.
  case 'EVENT': {
    handleEvent(evt.eventData);
    response.json({statusCode: 200, eventData: {}});
    break;
  }
  default: {
    console.log(`Lifecycle ${lifecycle} not supported`);
  }
  }
};