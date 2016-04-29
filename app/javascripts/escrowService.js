(function(angular) {
  'use strict;'
  angular.module('contracts', [])
  .factory('escrowService', escrowService);

  function escrowService() {
    var contract = Escrow.deployed();
    function setSellerAndAmt(account) {
        contract.setSeller.call(account, {from: account}).then(function (val) {
            console.log(val);
        });
    }

    function getAmount(account) {
        contract.amount.call({from: account}).then(function (amount) {
            console.log(amount.toString());
        });
    }

    function setAmount(amount, account) {
        contract.amount.call(amount, {from: account}).then(function (val) {
            console.log(val.toString());
        });
    }

    function voidContract () {
    }

    function release(account) {
        contract.release.call({from: account}).then(function (value) {
            console.log(value);
        });
    }
    return {
      setSellerAndAmt: setSellerAndAmt,
      getAmount: getAmount,
      setAmount: setAmount,
      release: release,
      voidContract: voidContract
    }
  }
})(window.angular);
