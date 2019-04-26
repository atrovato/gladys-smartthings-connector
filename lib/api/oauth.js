const rp = require('request-promise');
const Promise = require('bluebird');

const util = require('../util.js');

const generateUrl = (user, pass) => {
  return `https://${user}:${pass}@auth-global.api.smartthings.com/oauth/token`;
};

let refreshTimer;
const cache = {};
const thirtyDays = 155520000000;

const storeRefreshToken = (authInfo) => {
  cache.accessToken = authInfo.accessToken;
  cache.refreshToken = authInfo.refreshToken;
  cache.duration = authInfo.duration || thirtyDays;

  if (refreshTimer) {
    clearTimeout(refreshTimer);
  }

  refreshTimer = setTimeout(refreshToken, cache.duration - 2000);

  return Promise.resolve();
};

const refreshToken = () => {
  return Promise.resolve()
    .then(() => {
      if (cache.refreshToken) {
        return Promise.resolve(cache.refreshToken);
      } else {
        return Promise.reject('Refresh token not available, please update from SmartThings App');
      }
    }).then((refreshTokenValue) => {
      return util.getOAuthCredentials()
        .then((oauth) => {
          const options = {
            url: generateUrl(oauth.client, oauth.secret),
            method: 'POST',
            json: true,
            form: {
              grant_type: 'refresh_token',
              client_id: oauth.client,
              client_secret: oauth.secret,
              refresh_token: refreshTokenValue
            }
          };

          return rp(options);
        }).then((res) => {
          const token = {
            accessToken: res.access_token,
            refreshToken: res.refresh_token,
            duration: res.expires_in
          };

          return storeRefreshToken(token)
            .then(() => {
              return Promise.resolve(res.access_token);
            });
        });
    });
};

module.exports = {

  storeRefreshToken: storeRefreshToken,

  getAccessToken: () => {
    if (cache.accessToken) {
      return Promise.resolve(cache.accessToken);
    } else {
      return refreshToken();
    }
  }
};
