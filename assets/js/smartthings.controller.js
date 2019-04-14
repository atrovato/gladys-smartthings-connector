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

    loadPublicKey();

    function loadPublicKey() {
      vm.loading = 'SMT_LOAD_PUBLIC_KEY';

      paramService.getByName('SMT_PUBLIC_KEY')
        .then((param) => {
          vm.publicKey = param.data.value;
          loadHouses();
        }).catch(() => {
          vm.step = 'SMT_CONNECT';
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
          loadHouses();
        }).catch(() => {
          vm.loading = null;
        });
    }

    function loadHouses() {
      vm.loading = 'SMT_LOAD_HOUSES';
      vm.step = 'SMT_CONFIG_HOUSES';
    }
  }
})();