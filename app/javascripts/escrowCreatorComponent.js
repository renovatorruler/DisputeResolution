(function(angular) {
  'use strict';
  angular.module('escrowCreator', ['accounts', 'contracts'])
    .component('escrowCreator', {
      template: [
      '<div class="uk-container uk-container-center uk-grid">',
      '    <h1>EscrowCreator</h1>',
      '    <ng-outlet class="uk-width-1-1"></ng-outlet>',
      '</div>'
      ].join(''),
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
                    console.log("error", e);
                });
            }
        };
        this.$routerOnActivate = function(next) {
        };
    }

    function escrowCreatorDetailComponent(accountService, escrowCreatorService, $scope) {
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
            });
        };
    }
})(window.angular);
