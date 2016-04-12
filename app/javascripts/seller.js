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
