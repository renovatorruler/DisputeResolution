const R = require('ramda');
const BigNumber = require('bignumber.js');

const BrehonContract = artifacts.require("./BrehonContract.sol");
const defaults = require('../config/deployment_settings.js').defaults;

const contractHelpers = require('../lib/contractHelpers.js');
const startContractAndRaiseDispute = contractHelpers.startContractAndRaiseDispute;
const getMinimumContractAmt = contractHelpers.getMinimumContractAmt;
const getSplitForPrimaryBrehon = contractHelpers.getPercentageSplit(defaults, 0);
const getSplitForSecondaryBrehon = contractHelpers.getPercentageSplit(defaults, 1);
const PartyStruct = contractHelpers.PartyStruct;
const BrehonStruct = contractHelpers.BrehonStruct;

const verifyEvent = R.curry((eventName, expectedArgs, resultObj) => {
    var event = R.find(R.propEq('event', eventName), result.logs);
    assert.isNotNull(event, eventName + " was not emitted");
    R.mapObjIndexed((expectedArgValue, expectedArgName) => {
        assert.equal(event.args[expectedArgName], expectedArgValue, "");
    }, expectedArgs);
    assert.equal(event.args._appealLevel, 2,
        "SettlementProposed event did not correctly provide the appealLevel");
    assert.equal(settlementProposedEvent.args._activeBrehon, defaults.tertiaryBrehon_addr,
        "SettlementProposed event did not correctly provide the activeBrehon's address");
    assert.isDefined(settlementProposedEvent, "ContractStarted event was not emitted");
    return result;
});

contract('BrehonContract should allow partyA to propose a settlement', (accounts) => {
  const settlement = {
      'partyA': getSplitForPrimaryBrehon(60),
      'partyB': getSplitForPrimaryBrehon(40)
  };
  it('at Dispute stage', () => {
    var brehonContract;
    return BrehonContract.deployed()
      .then(function captureReference(instance) {
        brehonContract = instance;
        return instance;
      })
      .then(startContractAndRaiseDispute(
        [{
          addr: defaults.partyA_addr,
          value: getMinimumContractAmt(defaults)
        }], defaults.partyA_addr, defaults.partyA_addr))
      .then(function proposeSettlement() {
        return brehonContract.proposeSettlement(
            settlement.partyA,
            settlement.partyB,
            {from: defaults.primaryBrehon_addr}
        );
      })
      .then(function verifySettlementProposedEvent(result) {
        var settlementProposedEvent = R.find(R.propEq('event', 'SettlementProposed'), result.logs);
        assert.equal(settlementProposedEvent.args._appealLevel, 2,
          "SettlementProposed event did not correctly provide the appealLevel");
        assert.equal(settlementProposedEvent.args._activeBrehon, defaults.tertiaryBrehon_addr,
          "SettlementProposed event did not correctly provide the activeBrehon's address");
        assert.isDefined(settlementProposedEvent, "ContractStarted event was not emitted");
        return result;
      })
      /**
      .then(function verifyAppealLevel() {
        return brehonContract.proposedSettlements.call().then((proposedSettlements) => {
            assert.equal(proposedSettlements[0].valueOf(), 2, "Appeal level not set correctly");
        });
      })
      **/
      .catch(function handleException(err) {
        console.log(err);
        assert.isNull(err, "Exception was thrown when partyA tried to raise an appeal");
      });
  });
});
