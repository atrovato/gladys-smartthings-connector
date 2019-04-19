const Promise = require('bluebird');

/**
 * Creates the app info for this installed app.
 */
function createConfigInitializeSetting() {
  return {
    initialize: {
      id: 'gladys',
      name: 'Gladys',
      description: 'Gladys SmartThings connector',
      permissions: ['r:devices:*', 'w:devices:*', 'i:deviceprofiles'],
      firstPageId: 'gladysPage'
    }
  };
}

/**
 * Creates the configuration page for end user to configure this installation.
 * @param pageId name of page to send to user
 * @param currentConfig the values of the currently set configurations by the user for the settings
 */
function createConfigPage(pageId, currentConfig) {
  if (pageId !== 'gladysPage') {
    return Promise.reject(`Unsupported page name: ${pageId}`);
  } else {
    return {
      page: {
        pageId: 'gladysPage',
        name: 'Gladys information',
        nextPageId: null,
        previousPageId: null,
        complete: true
      }
    };
  }
}

/**
 * Creates the configuration required to install this app.
 * @param event - the event object.
 */
module.exports = function (evt, response) {
  const event = evt.configurationData;
  if (!event.config) {
    return Promise.reject('No config section set in request.');
  } else {
    return Promise.resolve()
      .then(() => {
        const phase = event.phase;
        console.log(`SmartThings Connector : Configuration phase ${phase}`);
        switch (phase) {
        case 'INITIALIZE':
          return createConfigInitializeSetting();
        case 'PAGE':
          const pageId = event.pageId;
          const settings = event.config;
          return createConfigPage(pageId, settings);
        default:
          return Promise.reject(`Unsupported config phase: ${phase}`);
        }
      }).then((config) => {
        response.json({ statusCode: 200, configurationData: config });
        return Promise.resolve();
      });
  }
};
