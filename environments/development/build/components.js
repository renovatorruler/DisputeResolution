

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
        selectedAccount = account;
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


(function(angular) {
  'use strict';
  angular.module('buyer', ['accounts', 'contracts'])
    .component('buyer', {
      template: [
      '<div class="uk-width-1-1">',
      '    <h1>Buyer</h1>',
      '    <ng-outlet></ng-outlet>',
      '</div>'
      ].join(''),
      $routeConfig: [
        {path: '/', name: 'BuyerSetup', component: 'buyerSetup', useAsDefault: true},
        {path: '/:contractAddress', name: 'BuyerMain', component: 'buyerMain'}
      ]
    })

    .component('buyerSetup', {
      templateUrl: 'partials/buyer.html',
      controller: buyerSetupComponent
    })

    .component('buyerMain', {
      templateUrl: 'partials/buyerMain.html',
      controller: buyerMainComponent
    });

    function buyerSetupComponent(accountService, escrowService) {
        var $ctrl = this;
        $ctrl.release = function release() {
            escrowService.release(accountService.getSelectedAccount());
        };
        this.$routerOnActivate = function(next) {
        };
    }

    function buyerMainComponent() {
        var $buyerMainCtrl = this;
        this.$routerOnActivate = function(next) {
        };
    }
})(window.angular);


(function(angular) {
  'use strict';
  angular.module('seller', ['accounts', 'contracts'])
    .component('seller', {
      template: [
      '<div class="uk-width-1-1">',
      '    <h1>Seller</h1>',
      '    <ng-outlet></ng-outlet>',
      '</div>'
      ].join(''),
      $routeConfig: [
        {path: '/', name: 'SellerSetup', component: 'sellerSetup', useAsDefault: true},
        {path: '/:contractAddress', name: 'SellerMain', component: 'sellerMain'}
      ]
    })

    .component('sellerSetup', {
      templateUrl: 'partials/seller.html',
      controller: sellerSetupComponent
    })

    .component('sellerMain', {
      templateUrl: 'partials/sellerMain.html',
      controller: sellerMainComponent
    });

    function sellerSetupComponent(accountService, escrowService) {
    var $ctrl = this;
    $ctrl.setAmount = function release() {
        escrowService.setAmount($ctrl.amount, accountService.getSelectedAccount());
    };
    $ctrl.getAmount = function release() {
        $ctrl.contractAmount = escrowService.getAmount(accountService.getSelectedAccount());
    };
    this.$routerOnActivate = function(next) {
        $ctrl.contractAmount = escrowService.getAmount(accountService.getSelectedAccount());
    };
  }

  function sellerMainComponent() {
    var $sellerMainCtrl = this;
    this.$routerOnActivate = function(next) {
    };
  }
})(window.angular);


(function(angular) {
  'use strict';
  angular.module('arbitrator', [])
    .component('arbitrator', {
      template: [
      '<div class="uk-width-1-1">',
      '    <h1>Arbitrator</h1>',
      '    <ng-outlet></ng-outlet>',
      '</div>'
      ].join(''),
      $routeConfig: [
        {path: '/', name: 'ArbitratorSetup', component: 'arbitratorSetup', useAsDefault: true},
        {path: '/:contractAddress', name: 'ArbitratorMain', component: 'arbitratorMain'}
      ]
    })

    .component('arbitratorSetup', {
      templateUrl: 'partials/arbitrator.html',
      controller: arbitratorSetupComponent
    })

    .component('arbitratorMain', {
      templateUrl: 'partials/arbitratorMain.html',
      controller: arbitratorMainComponent
    });

  function arbitratorSetupComponent() {
    var $ctrl = this;
    this.$routerOnActivate = function(next) {
    };
  }

  function arbitratorMainComponent() {
    var $arbitratorMainCtrl = this;
    this.$routerOnActivate = function(next) {
    };
  }
})(window.angular);


(function(angular) {
  'use strict;'
  angular.module('contracts', [])
  .factory('escrowService', escrowService);

  function escrowService() {
    var contract = Escrow.deployed();
    function setSellerAndAmt(account) {
        console.log("contract.setSellerAndAmt");
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
