const R = require('ramda');
const BigNumber = require('bignumber.js');
const defaults = require('../config/deployment_settings.js').defaults;

const PartyStruct = {
  addr: 0,
  deposit: 1,
  contractAccepted: 2,
};

const BrehonStruct = {
  addr: 0,
  contractAccepted: 1,
  fixedFee: 2,
  disputeFee: 3,
};

const StagesStruct = {
  Negotiation: 0,
  Execution: 1,
  Dispute: 2,
  Resolved: 3,
  AppealPeriod: 4,
  Appeal: 5,
  SecondAppealPeriod: 6,
  SecondAppeal: 7,
  Completed: 8,
};

const ResolutionStruct = {
  proposerAddr: 0,
  awardPartyA: 1,
  awardPartyB: 2,
  partyAAccepted: 3,
  partyBAccepted: 4,
};

const UndefinedAddress = '0x0000000000000000000000000000000000000000';

const UninitializedResolution = [
  UndefinedAddress,
  new BigNumber('0'),
  new BigNumber('0'),
  false,
  false,
];

const getMinimumContractAmt = contractSettings =>
  new BigNumber(contractSettings.transactionAmount)
    .add(new BigNumber(contractSettings.primaryBrehon_fixedFee))
    .add(new BigNumber(contractSettings.primaryBrehon_disputeFee))
    .add(new BigNumber(contractSettings.secondaryBrehon_fixedFee))
    .add(new BigNumber(contractSettings.secondaryBrehon_disputeFee))
    .add(new BigNumber(contractSettings.tertiaryBrehon_fixedFee))
    .add(new BigNumber(contractSettings.tertiaryBrehon_disputeFee))
    .valueOf();

const getPercentageSplit = R.curry((contractSettings, appealLevel, percent) => {
  let totalAmount = new BigNumber(contractSettings.transactionAmount);
  if (appealLevel < 1) {
    totalAmount = totalAmount.add(new BigNumber(contractSettings.secondaryBrehon_disputeFee));
  }
  if (appealLevel < 2) {
    totalAmount = totalAmount.add(new BigNumber(contractSettings.tertiaryBrehon_disputeFee));
  }
  let splitAmount;
  if (percent < 0) {
    splitAmount = totalAmount - getPercentageSplit(contractSettings, appealLevel, percent * -1);
  } else {
    splitAmount = totalAmount.times(percent / 100);
  }
  return splitAmount;
});

const partyAddresses = [
  defaults.partyA_addr,
  defaults.partyB_addr,
];
const brehonAddresses = [
  defaults.primaryBrehon_addr,
  defaults.secondaryBrehon_addr,
  defaults.tertiaryBrehon_addr,
];

const acceptContractByAll = brehonContract =>
  R.reduce((acc, addr) =>
    acc.then(() => brehonContract.acceptContract({ from: addr })),
  Promise.resolve(brehonContract),
  R.concat(partyAddresses, brehonAddresses));


const verifyEvent = R.curry((eventName, expectedArgs, resultObj) => {
  const event = R.find(R.propEq('event', eventName), resultObj.logs);
  assert.isDefined(event, `${eventName} event was not emitted`);
  if (event) {
    R.mapObjIndexed((expectedArgValue, expectedArgName) => {
      let actual = event.args[expectedArgName];
      let expected = expectedArgValue;
      if (actual.toString) {
        actual = actual.toString();
        expected = expected.toString();
      }
      assert.equal(actual, expected, `${eventName} event did not correctly set ${expectedArgName}`);
    }, expectedArgs);
  }
  return resultObj;
});

const startContract = R.curry((partyContributions, startingPartyAddr, brehonContract) =>
  acceptContractByAll(brehonContract)
  .then(() => Promise.all(R.map(partyTuple =>
    brehonContract.deposit({
      from: partyTuple.addr,
      value: R.defaultTo(getMinimumContractAmt(defaults), partyTuple.value),
    })
    , partyContributions))
    .then(() => brehonContract.startContract({
      from: R.defaultTo(R.head(partyContributions), startingPartyAddr),
    }))));

const raiseDispute = R.curry((disputingPartyAddr, brehonContract) =>
  brehonContract.raiseDispute({
    from: disputingPartyAddr,
  }));

const startContractAndRaiseDispute = R.curry(
  (partyContributions, startingPartyAddr, disputingPartyAddr, brehonContract) =>
  startContract(partyContributions)(startingPartyAddr)(brehonContract)
    .then(() => raiseDispute(disputingPartyAddr)(brehonContract)));

const assertError = R.curry((message, err) => assert.include(err.message, 'VM Exception while processing transaction', message));

const assertNoError = R.curry((verbose, message, err) => {
  if (verbose) {
    console.error(err);
  }
  assert.isNull(err, message);
});

const fastForwardTime = R.curry((web3Obj, seconds, instance) =>
  new Promise((fulfill, reject) => {
    web3Obj.currentProvider.sendAsync({
      jsonrpc: '2.0',
      method: 'evm_increaseTime',
      id: 12346,
      params: [seconds],
    }, (err) => {
      if (err) reject(err);
      else fulfill(instance);
    });
  }));

module.exports = {
  startContract,
  raiseDispute,
  startContractAndRaiseDispute,
  fastForwardTime,
  verifyEvent,
  assertError,
  assertNoError,
  getMinimumContractAmt,
  getPercentageSplit,
  StagesStruct,
  PartyStruct,
  BrehonStruct,
  ResolutionStruct,
  UndefinedAddress,
  UninitializedResolution,
};
