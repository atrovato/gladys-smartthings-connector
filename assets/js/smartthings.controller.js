(function () {
  'use strict';

  angular
    .module('gladys')
    .controller('SmartthingsController', SmartthingsController);

  SmartthingsController.$inject = ['smartthingsService', '$filter', '$translate', '$scope'];

  function SmartthingsController(smartthingsService, $filter, $translate, $scope) {
    var vm = this;

    vm.installApp = installApp;
    vm.changeLocation = changeLocation;
    vm.cancelLocationCreation = cancelLocationCreation;
    vm.createLocation = createLocation;
    vm.saveLocations = saveLocations;

    vm.step = null;
    vm.loading = null;
    vm.progress = false;
    vm.error = null;

    vm.authToken = null;
    vm.targetUrl = null;
    vm.locations = null;
    vm.houses = null;

    vm.locationModal = false;
    vm.selectedHouse = null;
    vm.locationCreation = null;

    vm.moduleId = window.location.href.match(/.*module\/(\d*)\/.*/)[1];

    activate();

    function activate() {

      io.socket.on('smtHandleReq', function (params) {
        $scope.$apply(function () {
          vm.loading = 'SMT_REQ_' + params.step + '_' + params.status;
        });
      });

      loadConfiguration();
    }

    function loadConfiguration() {
      vm.progess = true;

      smartthingsService.loadConfiguration()
        .then((params) => {
          vm.authToken = params.data.authToken;
          vm.targetUrl = params.data.targetUrl;

          if (params.data.configured) {
            installApp();
          } else {
            vm.step = 'SMT_STEP_CONNECT';
            vm.progess = false;
          }
        }).catch(() => {
          vm.step = 'SMT_STEP_CONNECT';
          vm.progess = false;
        });
    }

    function installApp() {
      vm.progess = true;

      smartthingsService.installApp({ authToken: vm.authToken, targetUrl: vm.targetUrl, moduleId: vm.moduleId })
        .then(() => {
          vm.progess = false;
          loadLocations();
        }).catch(() => {
          vm.progess = false;
          vm.step = 'SMT_STEP_CONNECT';
        });
    }

    function loadLocations() {
      vm.progess = true;

      smartthingsService.loadLocations({ authToken: vm.authToken, targetUrl: vm.targetUrl, moduleId: vm.moduleId })
        .then((params) => {
          vm.locations = params.data.locations;
          vm.locations.splice(0, 0, { name: $filter('translate')('SMT_CREATE_LOCATION'), locationId: 'none' });
          vm.houses = params.data.houses;
          vm.progess = false;

          if (!vm.houses.find((house) => {
            return house.locationId;
          })) {
            vm.step = 'SMT_STEP_LOCATIONS';
          } else {
            vm.step = null;
          }
        }).catch(() => {
          vm.locations = null;
          vm.houses = null;
          vm.step = 'SMT_STEP_LOCATIONS';
          vm.progess = false;
        });
    }

    function changeLocation(house) {
      if (!house.locationId || house.locationId === 'none') {
        vm.locationModal = true;
        vm.selectedHouse = house;
        vm.locationCreation = {
          name: house.name,
          countryCode: (house.country || '').substring(0, 3).toUpperCase(),
          latitude: house.latitude,
          longitude: house.longitude,
          temperatureScale: 'C'
        };
        $('#modalSmt').modal('show');
      }
    }

    function cancelLocationCreation(removeLocation = true) {
      if (removeLocation) {
        vm.selectedHouse.locationId = null;
      }
      vm.locationModal = false;
      vm.selectedHouse = null;
      vm.locationCreation = null;
    }

    function createLocation() {
      vm.progress = true;

      smartthingsService.createLocation(vm.locationCreation)
        .then((location) => {
          vm.locations.push(location.data);
          vm.selectedHouse.locationId = location.locationId;
          $('#modalSmt').modal('hide');
          vm.progress = false;
          vm.error = null;
          cancelLocationCreation(false);
        }).catch((e) => {
          vm.progress = false;
          vm.error = e;
        });
    }

    function saveLocations() {
      vm.progess = true;

      smartthingsService.saveLocations({ houses: vm.houses, moduleId: vm.moduleId })
        .then(() => {
          vm.progess = false;
          vm.step = null;
        }).catch(() => {
          vm.progess = false;
        });
    }

  }
})();