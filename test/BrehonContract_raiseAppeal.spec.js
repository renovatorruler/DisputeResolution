const R = require('ramda');
const BigNumber = require('bignumber.js');

const BrehonContract = artifacts.require("./BrehonContract.sol");
const defaults = require('../config/deployment_settings.js').defaults;

const contractHelpers = require('../lib/contractHelpers.js');
const startContractAndRaiseDispute = contractHelpers.startContractAndRaiseDispute;
const getMinimumContractAmt = contractHelpers.getMinimumContractAmt;
const getSplitForPrimaryBrehon = contractHelpers.getPercentageSplit(defaults, 0);
const PartyStruct = contractHelpers.PartyStruct;
const BrehonStruct = contractHelpers.BrehonStruct;

contract('BrehonContract should not allow any party to raise an appeal', (accounts) => {
  it('when stage is set to Negotiation', () => {
  });

  it('when stage is set to Execution', () => {
  });

  it('when stage is set to AppealPeriod', () => {
  });
});

contract('BrehonContract should allow partyA to raise an appeal', (accounts) => {
  it('when he is dissatisfied by the resolution provided by the primaryBrehon', () => {
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
      .then(function verifyStage() {
        return brehonContract.stage.call().then((stage) => {
            assert.equal(stage.valueOf(), 2, "stage is not set to Stages.Dispute");
        });
      })
      .then(function verifyAppealLevel() {
        return brehonContract.appealLevel.call().then((appealLevel) => {
            assert.equal(appealLevel.valueOf(), 1, "Appeal level not set correctly");
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
        assert.isNull(err, "Exception was thrown when primaryBrehon tried to adjudicate a dispute");
      });
  });
});

contract('BrehonContract should allow partyB to raise an appeal', (accounts) => {
  it('when he is dissatisfied by the resolution provided by the primaryBrehon', () => {
  });
});

contract('BrehonContract should allow partyA to raise an appeal', (accounts) => {
  it('when he is dissatisfied by the resolution provided by the secondaryBrehon', () => {
  });
});

contract('BrehonContract should allow partyB to raise an appeal', (accounts) => {
  it('when he is dissatisfied by the resolution provided by the secondaryBrehon', () => {
  });
});

contract('BrehonContract should allow partyA to raise an appeal', (accounts) => {
  it('when he is dissatisfied by the resolution provided by the tertiaryBrehon', () => {
  });
});

contract('BrehonContract should allow partyB to raise an appeal', (accounts) => {
  it('when he is dissatisfied by the resolution provided by the tertiaryBrehon', () => {
  });
});
