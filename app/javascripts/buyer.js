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

    function buyerSetupComponent(accountService) {
        var $ctrl = this;
        this.$routerOnActivate = function(next) {
        accountService.getAccounts().then(function (accountList) {
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
