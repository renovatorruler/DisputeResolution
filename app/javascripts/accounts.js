(function(angular) {
  'use strict;'
  angular.module('accounts', [])
  .factory('accountService', accountService)
  .controller('accountSelectorController', accountSelectorController)
  .directive('accountSelector', function () {
      return {
        restrict: 'EA',
        template: [
            '<a href="" class="uk-navbar-nav-subtitle">{{$accountSelectorCtrl.selectedAccount}} <div>Selected Account</div></a>',
            '<div class="uk-dropdown uk-dropdown-navbar">',
            ' <ul id="accountSelector" name="accountSelector" class="uk-nav uk-nav-navbar">',
            '    <li class="uk-nav-header">Accounts</li>',
            '    <li ng-repeat="account in $accountSelectorCtrl.accounts" value="{{account}}">',
            '     <a ng-click="$accountSelectorCtrl.changeAccount(account)">{{account}}</a>',
            '    </li>',
            '  </ul>',
            '</div>',
        ].join(''),
        controller: accountSelectorController,
        controllerAs: '$accountSelectorCtrl'
      };
  })
  .controller('accountBalanceController', accountBalanceController)
  .directive('accountBalance', function () {
      return {
        restrict: 'EA',
        scope: {
            'address': '@'
        },
        template: [
        '<a href="" class="uk-navbar-nav-subtitle">',
        '   {{$accountBalanceCtrl.accountBalance}}',
        '   <div>Balance</div>',
        '</a>'
        ].join(''),
        controller: accountBalanceController,
        controllerAs: '$accountBalanceCtrl'
      };
  });

  function accountService($q) {
    var selectedAccount;
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

    function setSelectedAccount(account) {
        seelectedAccount = account;
    }

    function getSelectedAccount() {
        return selectedAccount;
    }
    return {
        getAccounts: getAccounts,
        setSelectedAccount: setSelectedAccount,
        getSelectedAccount: getSelectedAccount
    };
  }

  function accountSelectorController($scope, accountService) {
      var $accountSelectorCtrl = this;
      accountService.getAccounts().then(function (accountList) {
          $accountSelectorCtrl.accounts = accountList;
          $accountSelectorCtrl.selectedAccount = accountList[0];
          accountService.setSelectedAccount($accountSelectorCtrl.selectedAccount);
      });

      this.changeAccount = function accountChanged(newAccount) {
          $accountSelectorCtrl.selectedAccount = newAccount;
      };
  }

  function accountBalanceController($scope, $element, $attrs) {
      var $accountBalanceCtrl = this;
      $scope.$watch('address', function (address) {
          if(address) {
              web3.eth.getBalance(address, function (err, result) {
                  $accountBalanceCtrl.accountBalance = result.toString();
                  $scope.$apply();
              });
          }
      });
  }

})(window.angular);
