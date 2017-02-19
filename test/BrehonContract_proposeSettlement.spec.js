const R = require('ramda');

const BrehonContract = artifacts.require('./BrehonContract.sol');
const defaults = require('../config/deployment_settings.js').defaults;

const contractHelpers = require('../lib/contractHelpers.js');

const startContractAndRaiseDispute = contractHelpers.startContractAndRaiseDispute;
const getMinimumContractAmt = contractHelpers.getMinimumContractAmt;
const getSplitForPrimaryBrehon = contractHelpers.getPercentageSplit(defaults, 0);

const ResolutionStruct = {
  proposerAddr: 0,
  awardPartyA: 1,
  awardPartyB: 2,
};

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
            { from: defaults.partyA_addr }
        );
      })
      .then(verifyEvent('SettlementProposed', {
        '_proposingParty': defaults.partyA_addr,
        '_awardPartyA': settlement.partyA,
        '_awardPartyB': settlement.partyB,
      }))
      .then(function verifySettlementRecord() {
        return brehonContract.proposedSettlement.call().then((proposedSettlement) => {
            assert.equal(proposedSettlement[ResolutionStruct.awardPartyA].valueOf(),
              settlement.partyA.valueOf(), 'proposedSettlement not recorded correctly for partyA');
        });
      })
      .then(function verifySettlementRecord() {
        return brehonContract.proposedSettlement.call().then((proposedSettlement) => {
            assert.equal(proposedSettlement[ResolutionStruct.awardPartyB].valueOf(),
              settlement.partyB.valueOf(), 'proposedSettlement not recorded correctly for partyB');
        });
      })
      .then(function verifySettlementRecord() {
        return brehonContract.proposedSettlement.call().then((proposedSettlement) => {
            assert.equal(proposedSettlement[ResolutionStruct.proposerAddr],
              defaults.partyA_addr, 'proposedSettlement\'s proposer address not recorded correctly');
        });
      })
      .catch(function handleException(err) {
        console.log(err);
        assert.isNull(err, 'Exception was thrown when partyA tried to raise an appeal');
      });
  });
});
