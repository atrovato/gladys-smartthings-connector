(function () {
  'use strict';

  angular
    .module('gladys')
    .controller('SmartthingsController', SmartthingsController);

  SmartthingsController.$inject = ['paramService', '$translate', '$scope'];

  function SmartthingsController(paramService, $translate, $scope) {
    var vm = this;
    vm.savePublicKey = savePublicKey;

    vm.step = null;
    vm.loading = null;

    vm.publicKey = null;

    activate();
    
    function activate() {

      io.socket.on('smtHandleReq', function (params) {
        $scope.$apply(function () {
          
          switch (params.step) {
          case 'PING':
          case 'CONFIGURATION':
            vm.loading = 'SMT_REQ_' + params.step + '_' + params.status;
            break;
          default:
            vm.step = null;
            break;
          }
        });
      });

      loadPublicKey();
    }

    function loadPublicKey() {
      vm.loading = 'SMT_LOAD_PUBLIC_KEY';

      paramService.getByName('SMT_PUBLIC_KEY')
        .then((param) => {
          vm.publicKey = param.data.value;
          installApp();
        }).catch(() => {
          vm.step = 'SMT_STEP_CONNECT';
          vm.loading = null;
        });
    }

    function savePublicKey() {
      vm.loading = 'SMT_SAVE_PUBLIC_KEY';

      const moduleId = window.location.href.match(/.*module\/(\d*)\/.*/)[1];
      const publicKeyParam = {
        name: 'SMT_PUBLIC_KEY',
        value: vm.publicKey,
        module: moduleId,
        description: 'SmartThings Public Key'
      };
      paramService.create(publicKeyParam)
        .then((param) => {
          vm.publicKey = param.data.value;
          installApp();
        }).catch(() => {
          vm.loading = null;
        });
    }

    function installApp() {
      vm.step = 'SMT_STEP_INSTALL_APP';
      vm.loading = null;
    }
  }
})();