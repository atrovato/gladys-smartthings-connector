
module.exports = {
  smtURL: 'https://api.smartthings.com/v1',
  externalIdPrefix: 'gladys-',
  scopes: ['r:devices:*', 'w:devices:*', 'i:deviceprofiles', 'x:devices:*'],
  tokenParam: 'SMT_AUTH_TOKEN',
  targetUrlParam: 'SMT_TARGET_URL',
  smtAppIdParam: 'SMT_APP_ID',
  smtPublicKeyParam: 'SMT_PUBLIC_KEY',
  smtLocationLinkParam: 'SMT_LOCATION_LINK',
  smtAppTokenParam: 'SMT_APP_TOKEN'
};