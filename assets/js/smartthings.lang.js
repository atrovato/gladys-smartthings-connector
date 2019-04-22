var translationsEN = {
  SMT_MODULE: 'Samsung SmartThing Connector',
  SMT_STEP_CONNECT: 'SmartThings connection',
  SMT_CONNECT_DESCR: 'To connect Gladys to Samsung SmartThings, please following this instructions:',
  SMT_CONNECT_CREATE_TOKEN: 'Create a Samsung SmartThings authorization token',
  SMT_CONNECT_SELECT_TOKEN: 'Check following sections: Devices, Locations, Applications, Device Profiles',
  SMT_CONNECT_CHECK_TOKEN: 'Generate the token, and check that all following are available: r:locations:*, w:deviceprofiles, x:devices:*, l:devices, w:locations:*, r:devices:*, w:devices:*, x:locations:*, r:apps:*, r:deviceprofiles, w:apps:*',
  SMT_CONNECT_COPY_TOKEN: 'Copy the generated public key and paste it into the following field',
  SMT_CONNECT_AUTH_TOKEN: 'Authorization token:',
  SMT_CONNECT_TARGET_URL: 'Gladys public URL:',
  SMT_SAVE: 'Save',
  SMT_REQ_LOAD_CONFIG_IN_PROGRESS: 'Loading configuration...',
  SMT_REQ_LOAD_CONFIG_DONE: 'Loading configuration done',
  SMT_REQ_LOAD_CONFIG_FAIL: 'Loading configuration failed',
  SMT_REQ_SAVE_CONFIG_IN_PROGRESS: 'Saving configuration...',
  SMT_REQ_SAVE_CONFIG_DONE: 'Saving configuration done',
  SMT_REQ_SAVE_CONFIG_FAIL: 'Saving configuration failed',
  SMT_REQ_CHECK_APP_IN_PROGRESS: 'Check SmartThings App in progress...',
  SMT_REQ_CHECK_APP_DONE: 'Check SmartThings App done',
  SMT_REQ_CHECK_APP_FAIL: 'Check SmartThings App failed',
  SMT_REQ_CREATE_APP_IN_PROGRESS: 'Create SmartThings App in progress...',
  SMT_REQ_CREATE_APP_DONE: 'Create SmartThings App done',
  SMT_REQ_CREATE_APP_FAIL: 'Create SmartThings App failed',
  SMT_REQ_GET_LOCATIONS_APP_IN_PROGRESS: 'Loading SmartThings locations...',
  SMT_REQ_GET_LOCATIONS_APP_DONE: 'SmartThings locations loaded',
  SMT_REQ_GET_LOCATIONS_APP_FAIL: 'Error loading SmartThings locations'
};

var translationsFR = {
  SMT_MODULE: 'Samsung SmartThing Connector',
  SMT_STEP_CONNECT: 'Connexion à SmartThings',
  SMT_CONNECT_DESCR: 'Afin de pouvoir faire communiquer Gladys avec Samsung SmartThings, il est nécessaire de suivre les étapes suivantes :',
  SMT_CONNECT_CREATE_TOKEN: 'créer un jeton personnel',
  SMT_CONNECT_SELECT_TOKEN: 'cocher les sections suivantes : Appareils, Lieux, Profils d\'appareil',
  SMT_CONNECT_CHECK_TOKEN: 'générer le jeton et vérifier que les authorisations suivantes sont présentes: r:locations:*, w:deviceprofiles, x:devices:*, l:devices, w:locations:*, r:devices:*, w:devices:*, x:locations:*, r:apps:*, r:deviceprofiles, w:apps:*',
  SMT_CONNECT_COPY_TOKEN: 'copier le jeton généré et le coller dans le champ suivant',
  SMT_CONNECT_AUTH_TOKEN: 'Jeton personnel :',
  SMT_CONNECT_TARGET_URL: 'URL publique de Gladys :',
  SMT_SAVE: 'Enregistrer',
  SMT_REQ_LOAD_CONFIG_IN_PROGRESS: 'Chargement de la configuration...',
  SMT_REQ_LOAD_CONFIG_DONE: 'Chargement de la configuration terminé',
  SMT_REQ_LOAD_CONFIG_FAIL: 'Erreur lors du chargement de la configuration',
  SMT_REQ_SAVE_CONFIG_IN_PROGRESS: 'Enregistrement de la configuration...',
  SMT_REQ_SAVE_CONFIG_DONE: 'Enregistrement de la configuration terminé',
  SMT_REQ_SAVE_CONFIG_FAIL: 'Erreur lors de l\'enregistrement de la configuration',
  SMT_REQ_CHECK_APP_IN_PROGRESS: 'Vérification de l\'application SmartThings en cours...',
  SMT_REQ_CHECK_APP_DONE: 'Vérification de l\'application SmartThings terminée',
  SMT_REQ_CHECK_APP_FAIL: 'Erreur lors de la vérification de l\'application SmartThings',
  SMT_REQ_CREATE_APP_IN_PROGRESS: 'Création de l\'application SmartThings en cours...',
  SMT_REQ_CREATE_APP_DONE: 'Création de l\'application SmartThings terminée',
  SMT_REQ_CREATE_APP_FAIL: 'Erreur lors de la création de l\'application SmartThings',
  SMT_REQ_GET_LOCATIONS_APP_IN_PROGRESS: 'Chargement des lieux SmartThings en cours...',
  SMT_REQ_GET_LOCATIONS_APP_DONE: 'Chargement des lieux SmartThings terminé',
  SMT_REQ_GET_LOCATIONS_APP_FAIL: 'Erreur lors du chargement des lieux SmartThings',
};

angular
  .module('gladys')
  .config(['$translateProvider', function ($translateProvider) {
    // add translation table
    $translateProvider
      .translations('en', translationsEN)
      .translations('fr', translationsFR);
  }]);