import 'ace-css/css/ace.css';
import 'font-awesome/css/font-awesome.css';

import Web3 from 'web3';
import R from 'ramda';
import BigNumber from 'bignumber.js';

import BrehonAPI from './BrehonAPI';
import Elm from './../elm/Main.elm';
import { getPercentageSplit } from '../../lib/contractHelpers';
import defaults from '../../config/deployment_settings';

import './../index.html';

import '../stylesheets/brehon.css';

function updateAllParties(ports, brehonApp) {
  return Promise.all([
    brehonApp.getPartyA(),
    brehonApp.getPartyB(),
  ])
  .then(R.objOf('parties'))
  .then(partiesObj =>
    R.set(
      R.lensProp('totalDeposits'),
      R.reduce(
        (acc, val) => acc.plus(val),
        new BigNumber(0),
        R.map(R.prop('deposit'), partiesObj.parties)).valueOf(),
      partiesObj))
  .then(partiesObj => R.set(
    R.lensProp('parties'),
    R.map(
      R.over(R.lensProp('deposit'),
      num => num.valueOf()),
      partiesObj.parties)
    , partiesObj))
  .then(partiesObj =>
    ports.receiveAllParties.send({
      partyA: R.head(partiesObj.parties),
      partyB: R.last(partiesObj.parties),
      totalDeposits: partiesObj.totalDeposits,
    }));
}

function updateAllBrehons(ports, brehonApp) {
  return Promise.all([
    brehonApp.getPrimaryBrehon(),
    brehonApp.getSecondaryBrehon(),
    brehonApp.getTertiaryBrehon(),
  ])
    .then((brehons) => {
      ports.receiveAllBrehons.send({
        primaryBrehon: R.nth(0, brehons),
        secondaryBrehon: R.nth(1, brehons),
        tertiaryBrehon: R.nth(2, brehons),
      });
    });
}

function updateContractInfo(ports, brehonApp) {
  return brehonApp.getDeployed().then((brehonContract) => {
    brehonContract.instance.stage.call()
      .then(stage =>
        brehonApp.getTransactionAmount().then(transactionAmount =>
          ports.receiveContractInfo.send([
            brehonContract.address,
            Number(stage.valueOf()),
            transactionAmount.valueOf(),
          ])));
  });
}

function portHooks(elmApp, currentProvider) {
  const self = window;
  const ports = elmApp.ports;
  const brehonApp = new BrehonAPI(currentProvider);

  /**
  * Request Console.out for debugging
  **/
  ports.requestConsoleLog.subscribe(arg => console.debug(arg)); // eslint-disable-line no-console


  ports.requestAccounts.subscribe(() => {
    ports.receiveAccounts.send(web3.eth.accounts);

    setInterval(() => {
      if (web3.eth.accounts[0] !== self.selectedAccount) {
        self.selectedAccount = web3.eth.accounts[0];
        ports.receiveAccounts.send(web3.eth.accounts);
      }
    }, 1000);
  });

  ports.requestContractInfo.subscribe(() =>
    updateContractInfo(ports, brehonApp));

  ports.requestAllParties.subscribe(() =>
    updateAllParties(ports, brehonApp));

  ports.requestAllBrehons.subscribe(() =>
    updateAllBrehons(ports, brehonApp));

  ports.requestAcceptContractByParty.subscribe(party =>
    brehonApp.acceptContract(party.addr).then(() =>
      updateAllParties(ports, brehonApp)));


  ports.requestAcceptContractByBrehon.subscribe(brehon =>
    brehonApp.acceptContract(brehon.addr).then(() =>
      updateAllBrehons(ports, brehonApp)));

  ports.requestDepositFunds.subscribe((partyAmountTuple) => {
    const partyModel = partyAmountTuple[0];
    const amount = partyAmountTuple[1];
    return brehonApp.depositFunds(partyModel.struct.addr, amount)
      .then(() => updateAllParties(ports, brehonApp));
  });

  ports.requestStartContract.subscribe(addr =>
    brehonApp.startContract(addr).then(() =>
      updateContractInfo(ports, brehonApp)));

  ports.requestProposeSettlement.subscribe((proposal) => {
    const awardPartyA = getPercentageSplit(defaults.defaults, 0, 50);
    const awardPartyB = getPercentageSplit(defaults.defaults, 0, 50);
    return brehonApp.proposeSettlement(proposal[0], awardPartyA, awardPartyB)
      .then(() => updateContractInfo(ports, brehonApp));
  });
}

document.addEventListener('DOMContentLoaded', () => {
  const mountNode = document.getElementById('main');
  const brehonElmApp = Elm.Main.embed(mountNode);

  // Checking if Web3 has been injected by the browser (Mist/MetaMask)
  if (typeof web3 !== 'undefined') {
    console.warn('Using web3 detected from external source. If you find that your accounts don\'t appear, ensure you\'ve configured that source properly. If using MetaMask, see the following link. Feel free to delete this warning. :) http://truffleframework.com/tutorials/truffle-and-metamask');
    // Use Mist/MetaMask's provider
    window.web3 = new Web3(web3.currentProvider);
  } else {
    console.warn('No web3 detected. Falling back to http://localhost:8545. You should remove this fallback when you deploy live, as it\'s inherently insecure. Consider switching to Metamask for development. More info here: http://truffleframework.com/tutorials/truffle-and-metamask');
    // fallback - use your fallback strategy (local node / hosted node + in-dapp id mgmt / fail)
    window.web3 = new Web3(new Web3.providers.HttpProvider('http://localhost:8545'));
  }

  portHooks(brehonElmApp, web3.currentProvider);
});
