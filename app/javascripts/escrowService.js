(function(angular) {
  'use strict;'
  angular.module('contracts', [])
  .factory('escrowService', escrowService);

  function escrowService() {
    var contract = Escrow.deployed();
    function setSellerAndAmt(amount, account) {
        console.log("contract.setSellerAndAmt");
        contract.setSellerAndAmt.call(account, amount, {from: account}).then(function (val) {
            console.log(val);
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
      release: release,
      voidContract: voidContract
    }
  }
})(window.angular);
