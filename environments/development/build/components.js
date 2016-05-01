

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
        {path: '/', name: 'BuyerMain', component: 'buyerMain', useAsDefault: true},
        {path: '/setup/:token', name: 'BuyerSetup', component: 'buyerSetup'}
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
      '<div class="uk-container uk-container-center uk-grid">',
      '    <ng-outlet class="uk-width-1-1"></ng-outlet>',
      '</div>'
      ].join(''),
      $routeConfig: [
        {path: '/', name: 'SellerMain', component: 'sellerMain', useAsDefault: true},
        {path: '/setup/:token', name: 'SellerSetup', component: 'sellerSetup'}
      ]
    })

    .component('sellerSetup', {
      templateUrl: 'partials/sellerSetup.html',
      controller: sellerSetupComponent
    })

    .component('sellerMain', {
      templateUrl: 'partials/sellerMain.html',
      controller: sellerMainComponent
    });

    function sellerSetupComponent(accountService, escrowCreatorService, $scope) {
        var $ctrl = this;

        $ctrl.acceptContract = function acceptContract() {
            escrowCreatorService.sellerAccepts($ctrl.token, accountService.getSelectedAccount())
            .then(function (tx) {
                loadContractInfo();
            }).catch(function (e) {
                console.error(e);
            });
        };

        this.$routerOnActivate = function(next) {
            $ctrl.token = next.params.token;
            loadContractInfo();
        };

        function loadContractInfo() {
            escrowCreatorService.getEscrowInfo($ctrl.token, accountService.getSelectedAccount())
            .then(function (val) {

                $ctrl.buyerAddress = val[0];
                $ctrl.buyerSigned = val[1];
                $ctrl.sellerAddress = val[2];
                $ctrl.sellerSigned = val[3];
                $ctrl.amount = parseInt(val[4].toString(), 10);

                $scope.$apply();
            }).catch(function (e) {
                $ctrl.contractNotFound = true;
                $scope.$apply();
                console.error(e);
            });
        }
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


(function(angular) {
  'use strict';
  angular.module('escrowCreator', ['accounts', 'contracts', 'monospaced.qrcode'])
    .component('escrowCreator', {
      template: [
      '<div class="uk-container uk-container-center uk-grid">',
      '    <h1>EscrowCreator</h1>',
      '    <ng-outlet class="uk-width-1-1"></ng-outlet>',
      '</div>'
      ].join(''),
      bindings: { $router: '<' },
      $routeConfig: [
        {path: '/', name: 'EscrowCreatorSetup', component: 'escrowCreatorSetup', useAsDefault: true},
        {path: '/:token', name: 'EscrowCreatorDetail', component: 'escrowCreatorDetail'}
      ]
    })

    .component('escrowCreatorSetup', {
      templateUrl: 'partials/escrowCreator.html',
      bindings: { $router: '<' },
      controller: escrowCreatorSetupComponent
    })

    .component('escrowCreatorDetail', {
      templateUrl: 'partials/escrowCreatorDetail.html',
      bindings: { $router: '<' },
      controller: escrowCreatorDetailComponent
    });

    function escrowCreatorSetupComponent(accountService, escrowCreatorService, $scope) {
        var $ctrl = this;

        function validate() {
            var formValid = true;
            if(!$ctrl.buyerAddress || $ctrl.buyerAddress.length === 0) {
                $ctrl.invalidBuyersAddress = true;
                formValid = false;
            }

            if(!$ctrl.sellerAddress || $ctrl.sellerAddress.length === 0) {
                $ctrl.invalidSellersAddress = true;
                formValid = false;
            }
            if(!$ctrl.amount || $ctrl.amount.length === 0) {
                $ctrl.invalidAmount = true;
                formValid = false;
            }
            return formValid;
        }
        $ctrl.createContract = function () {
            if(validate()) {
                escrowCreatorService.initiateCreation($ctrl.buyerAddress, $ctrl.sellerAddress, $ctrl.amount, accountService.getSelectedAccount()).then(function (token) {
                    $ctrl.token = token;
                    $ctrl.$router.navigate(['EscrowCreatorDetail', {token: $ctrl.token}]);
                    $scope.$apply();
                }).catch(function (e) {
                    console.error(e);
                });
            }
        };
        this.$routerOnActivate = function(next) {
        };
    }

    function getBaseUrl(hash) {
        var fullUrl = window.location.origin + window.location.pathname;
        fullUrl += "#/" + hash;
        return fullUrl;
    }

    function escrowCreatorDetailComponent(accountService, escrowCreatorService, $scope, $rootRouter) {
        var $ctrl = this;
        $ctrl.contractNotFound = false;
        this.$routerOnActivate = function(next) {
            $ctrl.token = next.params.token;
            escrowCreatorService.getEscrowInfo($ctrl.token, accountService.getSelectedAccount())
            .then(function (val) {
                $ctrl.buyerUrl = getBaseUrl($rootRouter.generate(['Buyer', 'BuyerSetup', {token: $ctrl.token}]).toLinkUrl());
                $ctrl.sellerUrl = getBaseUrl($rootRouter.generate(['Seller', 'SellerSetup', {token: $ctrl.token}]).toLinkUrl());

                $ctrl.buyerAddress = val[0];
                $ctrl.buyerSigned = val[1];
                $ctrl.sellerAddress = val[2];
                $ctrl.sellerSigned = val[3];
                $ctrl.amount = parseInt(val[4].toString(), 10);

                $scope.$apply();
            }).catch(function (e) {
                $ctrl.contractNotFound = true;
                $scope.$apply();
                console.error(e);
            });
        };
    }
})(window.angular);


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
