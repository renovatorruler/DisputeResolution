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
        this.$routerOnActivate = function(next) {
            $ctrl.token = next.params.token;
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
        };
  }

  function sellerMainComponent() {
    var $sellerMainCtrl = this;
    this.$routerOnActivate = function(next) {
    };
  }
})(window.angular);
