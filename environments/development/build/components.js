

(function(angular) {
  'use strict;'
  angular.module('accounts', [])
  .factory('accounts', getAccounts);

  function getAccounts($q) {
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
})(window.angular);


(function(angular) {
  'use strict';
  angular.module('buyer', ['accounts'])
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

  function buyerSetupComponent(accounts) {
    var $ctrl = this;
    this.$routerOnActivate = function(next) {
      accounts.then(function (accountList) {
        $ctrl.accounts = accountList;
        $ctrl.selectedAccount = accountList[0];
      });
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
  angular.module('seller', [])
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

  function sellerSetupComponent() {
    var $ctrl = this;
    this.$routerOnActivate = function(next) {
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
    function setSellerAndAmt() {
        
    }
    return {
      setSellerAndAmt: setSellerAndAmt
    }
  }
})(window.angular);
