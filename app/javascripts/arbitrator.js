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
