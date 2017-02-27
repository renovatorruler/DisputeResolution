// Import libraries we need.
import Web3 from 'web3';
import $ from 'jquery';

import BrehonAPI from './BrehonAPI';

// Import the page's CSS. Webpack will know what to do with it.
import '../stylesheets/app.css';
import '../stylesheets/profiles.css';

let brehonApp;

window.App = {
  start: () => {
    const self = window.App;
    self.accounts = web3.eth.accounts;
    self.selectedAccount = web3.eth.accounts[0];

    brehonApp.start();
    self.updateInterface();
    setInterval(() => {
      if (self.accounts[0] !== self.selectedAccount) {
        self.selectedAccount = self.accounts[0];
        self.updateInterface();
      }
    }, 1000);
  },

  updateInterface: () => {
    const self = window.App;
    brehonApp.getDeployed().then((instance) => {
      console.debug(instance);
      console.debug('Selected Account:', self.selectedAccount);
      $('contract-address').text(instance.address);
      return instance;
    })
    .then(instance =>
      brehonApp.getPartyA().then((partyA) => {
        $('address[party="partyA"]').text(partyA.addr);
        $('section.partyA').attr('addr', partyA.addr);
        return instance;
      }))
    .then(instance =>
      brehonApp.getPartyB().then((partyB) => {
        $('address[party="partyB"]').text(partyB.addr);
        $('section.partyB').attr('addr', partyB.addr);
        return instance;
      }))
    .then(instance =>
      brehonApp.getPrimaryBrehon().then((primaryBrehon) => {
        $('address[party="primaryBrehon"]').text(primaryBrehon.addr);
        $('section.primaryBrehon').attr('addr', primaryBrehon.addr);
        return instance;
      }))
    .then(instance =>
      brehonApp.getSecondaryBrehon().then((secondaryBrehon) => {
        $('address[party="secondaryBrehon"]').text(secondaryBrehon.addr);
        $('section.secondaryBrehon').attr('addr', secondaryBrehon.addr);
        return instance;
      }))
    .then(instance =>
      brehonApp.getTertiaryBrehon().then((tertiaryBrehon) => {
        $('address[party="tertiaryBrehon"]').text(tertiaryBrehon.addr);
        $('section.tertiaryBrehon').attr('addr', tertiaryBrehon.addr);
        return instance;
      }))
    .then(instance =>
      $('section.party').each((index, el) => {
        console.log($(el).attr('addr'));
      }));
  },

  setStatus: (message) => {
    const status = document.getElementById('status');
    status.innerHTML = message;
  },

  //refreshBalance: () => {
    //const self = this;

    //let meta;
    //BrehonContract.deployed().then((instance) => {
      //meta = instance;
      //return meta.getBalance.call(account, { from: account });
    //}).then((value) => {
      //const balanceEl = document.getElementById('balance');
      //balanceEl.innerHTML = value.valueOf();
    //}).catch((e) => {
      //console.error(e);
      //self.setStatus('Error getting balance; see log.');
    //});
  //},
};

window.addEventListener('load', () => {
  // Checking if Web3 has been injected by the browser (Mist/MetaMask)
  if (typeof web3 !== 'undefined') {
    console.warn('Using web3 detected from external source. If you find that your accounts don\'t appear or you have 0 BrehonContract, ensure you\'ve configured that source properly. If using MetaMask, see the following link. Feel free to delete this warning. :) http://truffleframework.com/tutorials/truffle-and-metamask');
    // Use Mist/MetaMask's provider
    window.web3 = new Web3(web3.currentProvider);
  } else {
    console.warn('No web3 detected. Falling back to http://localhost:8545. You should remove this fallback when you deploy live, as it\'s inherently insecure. Consider switching to Metamask for development. More info here: http://truffleframework.com/tutorials/truffle-and-metamask');
    // fallback - use your fallback strategy (local node / hosted node + in-dapp id mgmt / fail)
    window.web3 = new Web3(new Web3.providers.HttpProvider('http://localhost:8545'));
  }

  brehonApp = new BrehonAPI(web3.currentProvider);

  window.App.start();
});
