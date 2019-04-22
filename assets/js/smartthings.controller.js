(function () {
  'use strict';

  angular
    .module('gladys')
    .controller('SmartthingsController', SmartthingsController);

  SmartthingsController.$inject = ['smartthingsService', 'paramService', '$translate', '$scope'];

  function SmartthingsController(smartthingsService, paramService, $translate, $scope) {
    var vm = this;

    vm.installApp = installApp;

    vm.step = null;
    vm.loading = null;

    vm.authToken = null;
    vm.targetUrl = null;

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
      vm.step = 'SMT_STEP_CONNECT';
      smartthingsService.loadConfiguration()
        .then((params) => {
          vm.authToken = params.data.authToken;
          vm.targetUrl = params.data.targetUrl;

          if (params.data.configured) {
            installApp();
          }
        });
    }

    function installApp() {
      vm.step = 'SMT_STEP_INSTALL_APP';

      const moduleId = window.location.href.match(/.*module\/(\d*)\/.*/)[1];
      smartthingsService.installApp({ authToken: vm.authToken, targetUrl: vm.targetUrl, moduleId: moduleId });
    }

  }
})();