const R = require('ramda');
const BigNumber = require('bignumber.js');

const BrehonContract = artifacts.require("./BrehonContract.sol");
const defaults = require('../config/deployment_settings.js').defaults;

const contractHelpers = require('../lib/contractHelpers.js');
const startContract = contractHelpers.startContract;
const startContractAndRaiseDispute = contractHelpers.startContractAndRaiseDispute;
const getMinimumContractAmt = contractHelpers.getMinimumContractAmt;
const getSplitForPrimaryBrehon = contractHelpers.getPercentageSplit(defaults, 0);
const getSplitForSecondaryBrehon = contractHelpers.getPercentageSplit(defaults, 1);
const PartyStruct = contractHelpers.PartyStruct;
const BrehonStruct = contractHelpers.BrehonStruct;

contract('BrehonContract should allow partyA to raise an appeal', (accounts) => {
  it('when he is dissatisfied by the resolution provided by the secondaryBrehon', () => {
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
      .then(function adjudicate() {
        return brehonContract.adjudicate(
            getSplitForPrimaryBrehon(100),
            getSplitForPrimaryBrehon(0),
            {from: defaults.primaryBrehon_addr}
        );
      })
      .then(function raiseAppeal() {
        return brehonContract.raiseAppeal(
            {from: defaults.partyA_addr}
        );
      })
      .then(function adjudicate() {
        return brehonContract.adjudicate(
            getSplitForSecondaryBrehon(100),
            getSplitForSecondaryBrehon(0),
            {from: defaults.secondaryBrehon_addr}
        );
      })
      .then(function verifyAppealRaisedEvent(result) {
        var appealRaisedEvent = R.find(R.propEq('event', 'AppealRaised'), result.logs);
        assert.equal(appealRaisedEvent.args._appealLevel, 2,
          "AppealRaised event did not correctly provide the appealLevel");
        assert.equal(appealRaisedEvent.args._activeBrehon, defaults.tertiaryBrehon_addr,
          "AppealRaised event did not correctly provide the activeBrehon's address");
        assert.isDefined(appealRaisedEvent, "ContractStarted event was not emitted");
        return result;
      })
      .then(function verifyStage() {
        return brehonContract.stage.call().then((stage) => {
            assert.equal(stage.valueOf(), 2, "stage is not set to Stages.Dispute");
        });
      })
      .then(function verifyAppealLevel() {
        return brehonContract.appealLevel.call().then((appealLevel) => {
            assert.equal(appealLevel.valueOf(), 2, "Appeal level not set correctly");
        });
      })
      .then(function verifyActiveBrehon() {
        return brehonContract.activeBrehon.call().then((activeBrehon) => {
            assert.equal(activeBrehon[BrehonStruct.contractAccepted], true, 'activeBrehon\'s contractAccepted should be set to true');
            assert.equal(activeBrehon[BrehonStruct.addr], defaults.secondaryBrehon_addr, 'activeBrehon\'s address not set to secondaryBrehon correctly');
            assert.equal(activeBrehon[BrehonStruct.fixedFee], defaults.secondaryBrehon_fixedFee, 'activeBrehon\'s fixedFee not set to secondaryBrehon\'s fixedFee');
            assert.equal(activeBrehon[BrehonStruct.disputeFee], defaults.secondaryBrehon_disputeFee, 'activeBrehon\'s disputeFee not set to secondaryBrehon\'s disputeFee');
        });
      })
      .catch(function handleException(err) {
        console.log(err);
        assert.isNull(err, "Exception was thrown when partyA tried to raise an appeal");
      });
  });
});

contract('BrehonContract should allow partyB to raise an appeal', (accounts) => {
  it('when he is dissatisfied by the resolution provided by the secondaryBrehon', () => {
  });
});
