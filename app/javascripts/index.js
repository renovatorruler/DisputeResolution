import 'ace-css/css/ace.css';
import 'font-awesome/css/font-awesome.css';

import Web3 from 'web3';
import R from 'ramda';
import BigNumber from 'bignumber.js';
import moment from 'moment';

import BrehonAPI from './BrehonAPI';
import Elm from './../elm/Main.elm';

import './../index.html';

import '../stylesheets/brehon.css';

const EventStructs = {
  ExecutionStarted: [
    'blockNumber',
    'txHash',
    'caller',
    'totalDeposits',
  ],
  SettlementProposed: [
    'blockNumber',
    'txHash',
    'proposingParty',
    'awardPartyA',
    'awardPartyB',
  ],
  DisputeResolved: [
    'blockNumber',
    'txHash',
    'awardPartyA',
    'awardPartyB',
  ],
  ContractDisputed: [
    'disputingParty',
    'activeBrehon',
  ],
  AppealPeriodStarted: [
    'appealPeriodStartTime',
    'activeBrehon',
    'awardPartyA',
    'awardPartyB',
  ],
  AppealRaised: [
    'appealingParty',
    'activeBrehon',
  ],
  SecondAppealRaised: [
    'appealingParty',
    'activeBrehon',
  ],
  FundsClaimed: [
    'claimingParty',
    'amount',
  ],
};

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
    .then(R.map(R.over(
      R.lensProp('fixedFee'),
      x => x.valueOf())))
    .then(R.map(R.over(
      R.lensProp('disputeFee'),
      x => x.valueOf())))
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
          brehonApp.getMinimumContractAmt().then(minimumContractAmt =>
            brehonApp.getActiveBrehon().then(activeBrehon =>
              brehonApp.getAppealPeriodInDays().then(appealPeriodInDays =>
                brehonApp.getAllAwards().then(awards =>
                  ports.receiveContractInfo.send([
                    brehonContract.address,
                    Number(stage.valueOf()),
                    transactionAmount.valueOf(),
                    minimumContractAmt.valueOf(),
                    Number(appealPeriodInDays.valueOf()),
                    activeBrehon.addr,
                    awards,
                  ])))))));
  });
}

function updateProposedSettlement(ports, brehonApp) {
  brehonApp.getProposedSettlement()
    .then(ports.receiveProposedSettlement.send);
}

function getPortCallbackByEvent(ports, eventName) {
  const eventNameCallbackMap = {
    ExecutionStarted: ports.receiveExecutionStartedEvent,
    SettlementProposed: ports.receiveSettlementProposedEvent,
    DisputeResolved: ports.receiveDisputeResolvedEvent,
    ContractDisputed: ports.receiveContractDisputedEvent,
    AppealPeriodStarted: ports.receiveAppealPeriodStartedEvent,
    AppealRaised: ports.receiveAppealRaisedEvent,
    SecondAppealRaised: ports.receiveSecondAppealRaisedEvent,
    FundsClaimed: ports.receiveFundsClaimedEvent,
  };
  return eventNameCallbackMap[eventName];
}

function getPortArgsByEvent(ports, eventName, portEventObj) {
  return R.map(value => portEventObj[value], EventStructs[eventName]);
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

  ports.requestProposeSettlement.subscribe(proposal =>
    brehonApp.proposeSettlement(
      proposal[0],
      new BigNumber(proposal[1]),
      new BigNumber(proposal[2]))
    .then(() => updateProposedSettlement(ports, brehonApp)));

  ports.requestProposedSettlement.subscribe(() =>
    updateProposedSettlement(ports, brehonApp));

  ports.requestAcceptSettlement.subscribe(proposal =>
    brehonApp.acceptSettlement(
      proposal[0],
      new BigNumber(proposal[1]),
      new BigNumber(proposal[2]))
    .then(() => updateContractInfo(ports, brehonApp)));

  const getDefaultBigNum = x => R.defaultTo(new BigNumber(0), x).valueOf();

  ports.requestAllEvents.subscribe(() =>
    brehonApp.getAllEvents((error, eventObj) => {
      if (error) console.error(error);

      const portEventObj = {
        blockNumber: eventObj.blockNumber,
        txHash: eventObj.transactionHash,
        caller: eventObj.args.caller,
        totalDeposits: getDefaultBigNum(eventObj.args.totalDeposits),
        proposingParty: eventObj.args.proposingParty,
        awardPartyA: getDefaultBigNum(eventObj.args.awardPartyA),
        awardPartyB: getDefaultBigNum(eventObj.args.awardPartyB),
        disputingParty: eventObj.args.disputingParty,
        activeBrehon: R.defaultTo(eventObj.args.activeBrehon, eventObj.args.activeBrehon),
        appealingParty: eventObj.args.appealingParty,
        appealPeriodStartTime:
          moment.unix(parseInt(
            getDefaultBigNum(eventObj.args.appealPeriodStartTime),
            10)).format(),
        claimingParty: eventObj.args.claimingParty,
        amount: getDefaultBigNum(eventObj.args.amount),
      };
      getPortCallbackByEvent(ports, eventObj.event)
        .send(getPortArgsByEvent(ports, eventObj.event, portEventObj));
    }));

  ports.requestRaiseDispute.subscribe(disputingAddress =>
    brehonApp.raiseDispute(disputingAddress)
    .then(() => updateContractInfo(ports, brehonApp)));

  ports.requestRaiseAppeal.subscribe(disputingAddress =>
    brehonApp.raiseAppeal(disputingAddress)
    .then(() => updateContractInfo(ports, brehonApp)));

  ports.requestRaiseSecondAppeal.subscribe(disputingAddress =>
    brehonApp.raiseSecondAppeal(disputingAddress)
    .then(() => updateContractInfo(ports, brehonApp)));

  ports.requestAdjudicate.subscribe(judgment =>
    brehonApp.adjudicate(
      judgment[0],
      new BigNumber(judgment[1]),
      new BigNumber(judgment[2]))
    .then(() => updateContractInfo(ports, brehonApp)));


  ports.requestWithdrawFunds.subscribe(withdrawingAddress =>
    brehonApp.withdrawFunds(withdrawingAddress)
    .then(() => updateContractInfo(ports, brehonApp)));

  ports.requestCreateContract.subscribe(partyAAddr =>
    console.info(partyAAddr));
}

window.addEventListener('load', () => {
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
