(function(angular) {
  'use strict;'
  angular.module('contracts', [])
  .factory('escrowCreatorService', escrowCreatorService);

  function escrowCreatorService() {
    var contract = EscrowCreator.deployed();
    function initiateCreation(buyer, seller, amount, account) {
        return contract.initiateCreation.call(buyer, seller, amount, {from: account});
    }
    return {
        initiateCreation: initiateCreation
    }
  }
})(window.angular);
