// Import libraries we need.
import Web3 from 'web3';

import BrehonAPI from './BrehonAPI';

// Import the page's CSS. Webpack will know what to do with it.
import '../stylesheets/app.css';

// The following code is simple to show off interacting with your contracts.
// As your needs grow you will likely need to change its form and structure.
// For application bootstrapping, check out window.addEventListener below.
let accounts;
let account;

/**
window.App = {
  start: () => {
    const self = this;

    // Get the initial account balance so it can be displayed.
    web3.eth.getAccounts((err, accs) => {
      if (err != null) {
        console.error('There was an error fetching your accounts.');
        return;
      }

      if (accs.length === 0) {
        console.error('Couldn\'t get any accounts! Make sure your Ethereum client is configured correctly.');
        return;
      }

      accounts = accs;
      account = accounts[0];

      self.refreshBalance();
    });
  },

  setStatus: (message) => {
    const status = document.getElementById('status');
    status.innerHTML = message;
  },

  refreshBalance: () => {
    const self = this;

    let meta;
    BrehonContract.deployed().then((instance) => {
      meta = instance;
      return meta.getBalance.call(account, { from: account });
    }).then((value) => {
      const balanceEl = document.getElementById('balance');
      balanceEl.innerHTML = value.valueOf();
    }).catch((e) => {
      console.error(e);
      self.setStatus('Error getting balance; see log.');
    });
  },

  sendCoin: () => {
    const self = this;

    const amount = parseInt(document.getElementById('amount').value, 10);
    const receiver = document.getElementById('receiver').value;

    this.setStatus('Initiating transaction... (please wait)');

    let meta;
    BrehonContract.deployed().then((instance) => {
      meta = instance;
      return meta.sendCoin(receiver, amount, { from: account });
    }).then(() => {
      self.setStatus('Transaction complete!');
      self.refreshBalance();
    }).catch((e) => {
      console.error(e);
      self.setStatus('Error sending coin; see log.');
    });
  },
};
**/

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

  const brehonApp = new BrehonAPI(web3.currentProvider);
  brehonApp.start();
});
