/**
var accounts;
var account;
var balance;

function setStatus(message) {
  var status = document.getElementById("status");
  status.innerHTML = message;
};

function refreshBalance() {
  var meta = MetaCoin.deployed();

  meta.getBalance.call(account, {from: account}).then(function(value) {
    var balance_element = document.getElementById("balance");
    balance_element.innerHTML = value.valueOf();
  }).catch(function(e) {
    console.log(e);
    setStatus("Error getting balance; see log.");
  });
};

function sendCoin() {
  var meta = MetaCoin.deployed();

  var amount = parseInt(document.getElementById("amount").value);
  var receiver = document.getElementById("receiver").value;

  setStatus("Initiating transaction... (please wait)");

  meta.sendCoin(receiver, amount, {from: account}).then(function() {
    setStatus("Transaction complete!");
    refreshBalance();
  }).catch(function(e) {
    console.log(e);
    setStatus("Error sending coin; see log.");
  });
};

window.onload = function() {
  web3.eth.getAccounts(function(err, accs) {
    if (err != null) {
      alert("There was an error fetching your accounts.");
      return;
    }

    if (accs.length == 0) {
      alert("Couldn't get any accounts! Make sure your Ethereum client is configured correctly.");
      return;
    }

    accounts = accs;
    account = accounts[0];

    refreshBalance();
  });
}
**/
(function(angular) {
  'use strict';
  var escrowArbitratedApp = angular.module('app', ['ngComponentRouter', 'accounts', 'buyer', 'seller', 'arbitrator'])

  .value('$routerRootComponent', 'app')
  
  .config(function($locationProvider) {
    //$locationProvider.html5Mode(true);
  })
  .component('app', {
    template: [
      '<nav class="uk-navbar">',
      '   <ul class="uk-navbar-nav">',
      '     <li class="uk-active"><a ng-link="[\'Buyer\']">Buyer</a></li>',
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
      {path: '/buyer/...', name: 'Buyer', component: 'buyer', useAsDefault: true},
      {path: '/seller/...', name: 'Seller', component: 'seller'},
      {path: '/arbitrator/...', name: 'Arbitrator', component: 'arbitrator'}
    ]
  });
  
})(window.angular);
