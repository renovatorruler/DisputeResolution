const R = require('ramda');
const BigNumber = require('bignumber.js');

const BrehonContract = artifacts.require("./BrehonContract.sol");
const defaults = require('../config/deployment_settings.js').defaults;

const contractHelpers = require('../lib/contractHelpers.js');
const startContractAndRaiseDispute = contractHelpers.startContractAndRaiseDispute;
const getMinimumContractAmt = contractHelpers.getMinimumContractAmt;
const getSplitForPrimaryBrehon = contractHelpers.getPercentageSplit(defaults, 0);

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
      .then(function verifyStage() {
        return brehonContract.stage.call().then((stage) => {
            assert.equal(stage.valueOf(), 4, "stage is not set to Stages.AppealPeriod");
        });
      })
      .then(function verifyPartyASplit() {
        return brehonContract.getActiveJudgmentByParty.call(defaults.partyA_addr).then((award) => {
            assert.equal(award.valueOf(), getSplitForPrimaryBrehon(100), "Award for partyA not accurately set");
        });
      })
      .then(function verifyPartyBSplit() {
        return brehonContract.getActiveJudgmentByParty.call(defaults.partyB_addr).then((award) => {
            assert.equal(award.valueOf(), getSplitForPrimaryBrehon(0), "Award for partyB not accurately set");
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
