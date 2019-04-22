(function () {
  'use strict';

  angular
    .module('gladys')
    .factory('smartthingsService', SmartthingsService);

  SmartthingsService.$inject = ['$http'];

  function SmartthingsService($http) {

    var service = {
      loadConfiguration: loadConfiguration,
      installApp: installApp
    };

    return service;

    function loadConfiguration() {
      return $http({ method: 'GET', url: '/smartthings-connector/load-configuration' });
    }

    function installApp(data) {
      return $http({ method: 'POST', url: '/smartthings-connector/install-app', data: data });
    }

  }
})();