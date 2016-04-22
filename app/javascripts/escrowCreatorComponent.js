(function(angular) {
  'use strict';
  angular.module('escrowCreator', ['accounts', 'contracts'])
    .component('escrowCreator', {
      template: [
      '<div class="uk-width-1-1">',
      '    <h1>EscrowCreator</h1>',
      '    <ng-outlet></ng-outlet>',
      '</div>'
      ].join(''),
      $routeConfig: [
        {path: '/', name: 'EscrowCreatorSetup', component: 'escrowCreatorSetup', useAsDefault: true},
        {path: '/:contractAddress', name: 'EscrowCreatorMain', component: 'escrowCreatorMain'}
      ]
    })

    .component('escrowCreatorSetup', {
      templateUrl: 'partials/escrowCreator.html',
      controller: escrowCreatorSetupComponent
    })

    .component('escrowCreatorMain', {
      templateUrl: 'partials/escrowCreatorMain.html',
      controller: escrowCreatorMainComponent
    });

    function escrowCreatorSetupComponent(accountService, escrowCreatorService) {
        var $ctrl = this;
        $ctrl.release = function release() {
            escrowService.release(accountService.getSelectedAccount());
        };
        this.$routerOnActivate = function(next) {
        };
    }

    function escrowCreatorMainComponent() {
        var $escrowCreatorMainCtrl = this;
        this.$routerOnActivate = function(next) {
        };
    }
})(window.angular);
