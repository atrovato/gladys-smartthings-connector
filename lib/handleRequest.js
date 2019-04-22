const Promise = require('bluebird');

// const status = require('./status.js');
const ping = require('./lifecycle/ping.js');
const config = require('./lifecycle/config.js');
const install = require('./lifecycle/install.js');
const update = require('./lifecycle/update.js');
const uninstall = require('./lifecycle/uninstall.js');
const event = require('./lifecycle/event.js');
const unknown = require('./lifecycle/unknown.js');

module.exports = function (req) {
  const evt = req.body;
  const lifecycle = evt.lifecycle;
  // const statusKey = 'SMT_REQ_LIFECYCLE_' + lifecycle;

  // status.progress(statusKey);

  let action;
  switch (lifecycle) {
  // PING happens during app creation. Purpose is to verify app
  // is alive and is who it says it is.
  case 'PING': {
    action = ping;
    break;
  }
  // CONFIGURATION happens as user begins to install the app.
  case 'CONFIGURATION': {
    action = config;
    break;
  }
  // INSTALL happens after a user finishes configuration, and installs the
  // app.
  case 'INSTALL': {
    action = install;
    break;
  }
  // UPDATE happens when a user updates the configuration of an
  // already-installed app.
  case 'UPDATE': {
    action = update;
    break;
  }
  // UNINSTALL happens when a user uninstalls the app.
  case 'UNINSTALL': {
    action = uninstall;
    break;
  }
  // EVENT happens when any subscribed-to event or schedule executes.
  case 'EVENT': {
    action = event;
    break;
  }
  default: {
    action = unknown;
  }
  }

  return Promise.resolve(action)
    .then((action) => {
      return action(evt);
    }).then((result) => {
      // status.done(statusKey);
      return Promise.resolve(result);
    }).catch((e) => {
      // status.fail(statusKey);
      return Promise.reject(e);
    });
};