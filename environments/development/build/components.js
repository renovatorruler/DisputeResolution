

(function(angular) {
  'use strict';
  angular.module('buyer', [])
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

  function buyerSetupComponent() {
    var $ctrl = this;
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
