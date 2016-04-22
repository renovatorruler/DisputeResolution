(function(angular) {
  'use strict;'
  angular.module('contracts', [])
  .factory('escrowCreatorService', escrowCreatorService);

  function escrowCreatorService() {
    var contract = EscrowCreator.deployed();
    function initiateCreation() {
    }
    return {
        initiateCreation: initiateCreation
    }
  }
})(window.angular);
