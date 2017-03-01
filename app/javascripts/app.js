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
    self.selectedAccount = web3.eth.accounts[0];

    brehonApp.start();
    self.initInterface().then(self.updateInterface);
    setInterval(() => {
      if (web3.eth.accounts[0] !== self.selectedAccount) {
        self.selectedAccount = web3.eth.accounts[0];
        self.updateInterface();
      }
    }, 1000);
  },

  initInterface: () => {
    const contractAcceptanceMsg = 'Contract Accepted';
    const contractNonAcceptanceMsg = 'Contract Acceptance Pending';
    return Promise.all([
      brehonApp.getDeployed().then((instance) => {
        $('contract-address').text(instance.address);
      }),
      brehonApp.getPartyA().then((partyA) => {
        if (partyA.contractAccepted) {
          $('[party="partyA"] contract-acceptance').text(contractAcceptanceMsg);
        } else {
          $('[party="partyA"] contract-acceptance').text(contractNonAcceptanceMsg);
        }
        $('[party="partyA"] address').text(partyA.addr);
        $('section.partyA').attr('addr', partyA.addr);
      }),
      brehonApp.getPartyB().then((partyB) => {
        if (partyB.contractAccepted) {
          $('[party="partyB"] contract-acceptance').text(contractAcceptanceMsg);
        } else {
          $('[party="partyB"] contract-acceptance').text(contractNonAcceptanceMsg);
        }
        $('[party="partyB"] address').text(partyB.addr);
        $('section.partyB').attr('addr', partyB.addr);
      }),
      brehonApp.getPrimaryBrehon().then((primaryBrehon) => {
        if (primaryBrehon.contractAccepted) {
          $('[party="primaryBrehon"] contract-acceptance').text(contractAcceptanceMsg);
        } else {
          $('[party="primaryBrehon"] contract-acceptance').text(contractNonAcceptanceMsg);
        }
        $('[party="primaryBrehon"] address').text(primaryBrehon.addr);
        $('section.primaryBrehon').attr('addr', primaryBrehon.addr);
      }),
      brehonApp.getSecondaryBrehon().then((secondaryBrehon) => {
        if (secondaryBrehon.contractAccepted) {
          $('[party="secondaryBrehon"] contract-acceptance').text(contractAcceptanceMsg);
        } else {
          $('[party="secondaryBrehon"] contract-acceptance').text(contractNonAcceptanceMsg);
        }
        $('[party="secondaryBrehon"] address').text(secondaryBrehon.addr);
        $('section.secondaryBrehon').attr('addr', secondaryBrehon.addr);
      }),
      brehonApp.getTertiaryBrehon().then((tertiaryBrehon) => {
        if (tertiaryBrehon.contractAccepted) {
          $('[party="tertiaryBrehon"] contract-acceptance').text(contractAcceptanceMsg);
        } else {
          $('[party="tertiaryBrehon"] contract-acceptance').text(contractNonAcceptanceMsg);
        }
        $('[party="tertiaryBrehon"] address').text(tertiaryBrehon.addr);
        $('section.tertiaryBrehon').attr('addr', tertiaryBrehon.addr);
      }),
    ]);
  },

  updateInterface: () => {
    const self = window.App;

    $('section.party').each((index, el) => {
      if ($(el).attr('addr') === self.selectedAccount) {
        $(el).addClass('active');
      } else {
        $(el).removeClass('active');
      }
    });
  },

  setStatus: (message) => {
    const status = document.getElementById('status');
    status.innerHTML = message;
  },
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
