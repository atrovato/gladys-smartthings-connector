var translationsEN = {
  SMT_MODULE: 'Samsung SmartThing Connector',
  SMT_STEP_CONNECT: 'SmartThings connection',
  SMT_CONNECT_DESCR: 'To connect Gladys to Samsung SmartThings, please following this instructions:',
  SMT_CONNECT_SUBSCRIBE: 'Create a Samsung SmartThings account',
  SMT_CONNECT_WORKSPACE: 'Connect to developer workspace',
  SMT_CONNECT_PROJECT_NEW: 'Go to the Samsung SmartThings workspace to create a new projet "Automation for the SmartThings App"',
  SMT_CONNECT_PROJECT_NAME: 'Fill the projet name (ex. "Gladys")',
  SMT_CONNECT_PROJECT_REGISTER: 'Register Automation App',
  SMT_CONNECT_PROJECT_WEBHOOK: 'Select "WebHook Endpoint" and fill the target URL with your external accessible Gladys URL (ex. https://GLADYS_URL/smartthings-connector/webhook?token=SECURITY_TOKEN where GLADYS_URL = external Gladys URL, SECURITY_TOKEN = a Galdys security token created from Parameters menu)',
  SMT_CONNECT_PROJECT_NEXT: 'Clic on "NEXT"',
  SMT_CONNECT_PROJECT_SCOPE: 'Select all "Scopes"',
  SMT_CONNECT_PROJECT_NAME: 'Fill the Automation Display Name (ex. Gladys)',
  SMT_CONNECT_PROJECT_SAVE: 'Clic on "SAVE" and wait for authentication',
  SMT_CONNECT_PROJECT_PUBLIC_KEY: 'Copy the generated public key and paste it into the following field',
  SMT_PUBLIC_KEY: 'Public Key:',
  SMT_SAVE: 'Save',
  SMT_LOAD_PUBLIC_KEY: 'Loading public key...',
  SMT_SAVE_PUBLIC_KEY: 'Saving public key...',
  SMT_STEP_INSTALL_APP: 'SmartThings App configuration',
  SMT_INSTALL_APP_DESC: 'Follow instructions on the official website',
  SMT_REQ_PING_IN_PROGRESS: 'Connection in progress...',
  SMT_REQ_PING_DONE: 'Connection done',
  SMT_REQ_PING_FAIL: 'Connection fails',
  SMT_REQ_CONFIGURATION_IN_PROGRESS: 'App configuration in progress...',
  SMT_REQ_CONFIGURATION_DONE: 'App configuration done',
  SMT_REQ_CONFIGURATION_FAIL: 'App configuration fails'
};

var translationsFR = {
  SMT_MODULE: 'Samsung SmartThing Connector',
  SMT_STEP_CONNECT: 'Connexion à SmartThings',
  SMT_CONNECT_DESCR: 'Afin de pouvoir faire communiquer Gladys avec Samsung SmartThings, il est nécessaire de suivre les étapes suivantes :',
  SMT_CONNECT_SUBSCRIBE: 'créer un compte Samsung SmartThings',
  SMT_CONNECT_WORKSPACE: 'se connecter au "Workspace"',
  SMT_CONNECT_PROJECT_NEW: 'aller sur l\'espace de travail Samsung SmartThings afin de créer un nouveau projet "Automation for the SmartThings App"',
  SMT_CONNECT_PROJECT_NAME: 'entrer le nom du projet (ex. "Gladys")',
  SMT_CONNECT_PROJECT_REGISTER: 'cliquer sur "REGISTER NOW" dans le cadre "Register Automation App"',
  SMT_CONNECT_PROJECT_WEBHOOK: 'sélectionner "WebHook Endpoint" et remplir le champ "Target URL" avec l\'adresse de Gladys accessible depuis l\'extérieur (ex. https://GLADYS_URL/smartthings-connector/webhook?token=SECURITY_TOKEN avec where GLADYS_URL = l\'adresse de Gladys accessible de l\'extérieur, SECURITY_TOKEN = un token de sécurité Gladys créé depuis le menu Paramètres)',
  SMT_CONNECT_PROJECT_NEXT: 'cliquer sur "NEXT"',
  SMT_CONNECT_PROJECT_SCOPE: 'sélectionner tous les "Scope"',
  SMT_CONNECT_PROJECT_NAME: 'remplir le champ "Automation Display Name" avec le nom visible de l\'application (ex. Gladys)',
  SMT_CONNECT_PROJECT_SAVE: 'cliquer sur "SAVE" et attendre la connexion',
  SMT_CONNECT_PROJECT_PUBLIC_KEY: 'copier la "Public Key" et la coller dans le champ ci-suit',
  SMT_PUBLIC_KEY: 'Clé publique :',
  SMT_SAVE: 'Enregistrer',
  SMT_LOAD_PUBLIC_KEY: 'Chargement de la clé publique...',
  SMT_SAVE_PUBLIC_KEY: 'Enregistrement de la clé publique...',
  SMT_STEP_INSTALL_APP: 'Configuration de l\'application SmartThings',
  SMT_INSTALL_APP_DESC: 'Suivre les instructions sur le site officiel',
  SMT_REQ_PING_IN_PROGRESS: 'Connexion en cours...',
  SMT_REQ_PING_DONE: 'Connexion terminée',
  SMT_REQ_PING_FAIL: 'Echec de la connexion',
  SMT_REQ_CONFIGURATION_IN_PROGRESS: 'Configuration de l\'App en cours...',
  SMT_REQ_CONFIGURATION_DONE: 'Configuration de l\'App terminée',
  SMT_REQ_CONFIGURATION_FAIL: 'Echec de la configuration de l\'App'
};

angular
  .module('gladys')
  .config(['$translateProvider', function ($translateProvider) {
    // add translation table
    $translateProvider
      .translations('en', translationsEN)
      .translations('fr', translationsFR);
  }]);