

(function(angular) {
  'use strict';
  angular.module('buyer', [])
    .component('buyer', {
      template: '<h1>Buyer</h1><ng-outlet></ng-outlet>',
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
