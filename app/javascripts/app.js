(function(angular) {
  'use strict';
  var escrowArbitratedApp = angular.module('app', [
      'ngComponentRouter',
      'accounts',
      'buyer',
      'seller',
      'escrowCreator',
      'arbitrator',
      'contracts'
  ])

  .value('$routerRootComponent', 'app')
  
  .config(function($locationProvider) {
    //$locationProvider.html5Mode(true);
  })
  .component('app', {
    template: [
      '<nav class="uk-navbar">',
      '   <ul class="uk-navbar-nav">',
      '     <li class="uk-active"><a ng-link="[\'Contract\']">Contract</a></li>',
      '     <li><a ng-link="[\'Buyer\']">Buyer</a></li>',
      '     <li><a ng-link="[\'Seller\']">Seller</a></li>',
      '     <li><a ng-link="[\'Arbitrator\']">Arbitrator</a></li>',
      '     <li class="uk-parent" account-selector data-uk-dropdown></li>',
      '   </ul>',
      '   <div class="uk-navbar-flip">',
      '   <ul class="uk-navbar-nav">',
      '     <li account-balance address={{$accountSelectorCtrl.selectedAccount}}></li>',
      '   </ul>',
      '   </div>',
      '</nav>',
      '<ng-outlet class="uk-grid uk-container"></ng-outlet>'
      ].join(''),
    $routeConfig: [
      {path: '/contract/...', name: 'Contract', component: 'escrowCreator', useAsDefault: true},
      {path: '/buyer/...', name: 'Buyer', component: 'buyer'},
      {path: '/seller/...', name: 'Seller', component: 'seller'},
      {path: '/arbitrator/...', name: 'Arbitrator', component: 'arbitrator'}
    ]
  });
  
})(window.angular);
