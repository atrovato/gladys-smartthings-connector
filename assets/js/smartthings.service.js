(function () {
  'use strict';

  angular
    .module('gladys')
    .factory('smartthingsService', SmartthingsService);

  SmartthingsService.$inject = ['$http'];

  function SmartthingsService($http) {

    var service = {
      loadConfiguration: loadConfiguration,
      installApp: installApp,
      loadLocations: loadLocations,
      createLocation: createLocation,
      saveLocations: saveLocations
    };

    return service;

    function loadConfiguration() {
      return $http({ method: 'GET', url: '/smartthings-connector/load-configuration' });
    }

    function installApp(data) {
      return $http({ method: 'POST', url: '/smartthings-connector/install-app', data: data });
    }

    function loadLocations() {
      return $http({ method: 'GET', url: '/smartthings-connector/load-locations' });
    }

    function createLocation(data) {
      return $http({ method: 'POST', url: '/smartthings-connector/create-location', data: data });
    }

    function saveLocations(data) {
      return $http({ method: 'POST', url: '/smartthings-connector/save-locations', data: data });
    }
  }
})();