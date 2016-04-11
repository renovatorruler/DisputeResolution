(function(angular) {
  'use strict;'
  angular.module('contracts', [])
  .factory('escrowService', escrowService);

  function escrowService() {
    function setSellerAndAmt() {
        
    }
    return {
      setSellerAndAmt: setSellerAndAmt
    }
  }
})(window.angular);
