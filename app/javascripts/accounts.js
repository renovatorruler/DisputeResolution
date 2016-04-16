(function(angular) {
  'use strict;'
  angular.module('accounts', [])
  .factory('accountService', accountService)
  .controller('accountBalanceController', accountBalanceController)
  .directive('accountBalance', function () {
      return {
        restrict: 'EA',
        template: '<div>Hello</div>',
        scope: {
            accounts: '='
        },
        controller: accountBalanceController,
        controllerAs: '$accountBalanceCtrl'
      };
  });

  function accountService($q) {
    function getAccounts() {
        var deferred = $q.defer();
        web3.eth.getAccounts(function(err, accs) {
        if (err != null) {
            deferred.reject("There was an error fetching your accounts.");
            return;
        }

        if (accs.length == 0) {
            deferred.reject("Couldn't get any accounts! Make sure your Ethereum client is configured correctly.");
            return;
        }

        accounts = accs;
        account = accounts[0];

        deferred.resolve(accounts);
        });
        return deferred.promise;
    }
    return {
        getAccounts: getAccounts
    };
  }

  function accountBalanceController($scope) {
      var $accountBalanceCtrl = this;
      console.log($scope);
  }

})(window.angular);
