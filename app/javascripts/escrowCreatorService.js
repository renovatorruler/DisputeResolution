(function(angular) {
  'use strict;'
  angular.module('contracts', [])
  .factory('escrowCreatorService', escrowCreatorService);

  function escrowCreatorService() {
    var contract = EscrowCreator.deployed();

    function initiateCreation(buyer, seller, amount, account) {
      return contract.initiateCreation(buyer, seller, amount, {from: account}).then(function (tx) {
        var txInfo = web3.eth.getTransaction(tx);
        return contract.keyGenerator.call(buyer, seller, amount, txInfo["blockNumber"], {from: account});
      });
    }

    function getEscrowInfo(token, account) {
      return contract.getEscrowInfo.call(token, {from: account});
    }

    function buyerAccepts(token, account) {
      return contract.buyerAccepts(token, {from: account});
    }

    function sellerAccepts(token, account) {
      return contract.sellerAccepts(token, {from: account});
    }
    return {
        initiateCreation: initiateCreation,
        getEscrowInfo: getEscrowInfo,
        buyerAccepts: buyerAccepts,
        sellerAccepts: sellerAccepts
    }
  }
})(window.angular);
