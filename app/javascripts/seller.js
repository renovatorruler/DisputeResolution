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
