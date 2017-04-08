const BrehonContract = artifacts.require('./BrehonContract.sol');

const defaults = require('../config/deployment_settings.js').defaults;
const contractHelpers = require('../lib/contractHelpers.js');

const startContract = contractHelpers.startContract;
const startContractAndRaiseDispute = contractHelpers.startContractAndRaiseDispute;
const getMinimumContractAmt = contractHelpers.getMinimumContractAmt;
const getSplitForPrimaryBrehon = contractHelpers.getPercentageSplit(defaults, 0);
const getSplitForSecondaryBrehon = contractHelpers.getPercentageSplit(defaults, 1);
const getSplitForTertiaryBrehon = contractHelpers.getPercentageSplit(defaults, 2);

contract('BrehonContract should allow primaryBrehon to adjudicate the contract', () => {
  it('in the favor of partyA completely', () => {
    let brehonContract;
    return BrehonContract.deployed()
      .then(function captureReference(instance) {
        brehonContract = instance;
        return instance;
      })
      .then(startContractAndRaiseDispute(
        [{
          addr: defaults.partyA_addr,
          value: getMinimumContractAmt(defaults),
        }], defaults.partyA_addr, defaults.partyA_addr))
      .then(function adjudicate() {
        return brehonContract.adjudicate(
          getSplitForPrimaryBrehon(100),
          getSplitForPrimaryBrehon(0),
          { from: defaults.primaryBrehon_addr });
      })
      .then(function verifyStage() {
        return brehonContract.stage.call().then((stage) => {
          assert.equal(stage.valueOf(), 4, 'stage is not set to Stages.AppealPeriod');
        });
      })
      .then(function verifyPartyASplit() {
        return brehonContract.getActiveJudgmentByParty.call(defaults.partyA_addr).then((award) => {
          assert.equal(award.valueOf(), getSplitForPrimaryBrehon(100), 'Award for partyA not accurately set');
        });
      })
      .then(function verifyPartyBSplit() {
        return brehonContract.getActiveJudgmentByParty.call(defaults.partyB_addr).then((award) => {
          assert.equal(award.valueOf(), getSplitForPrimaryBrehon(0), 'Award for partyB not accurately set');
        });
      })
      .catch(function handleException(err) {
        assert.isNull(err, 'Exception was thrown when primaryBrehon tried to adjudicate a dispute');
      });
  });
});

contract('BrehonContract should allow primaryBrehon to adjudicate the contract', () => {
  it('in the favor of partyB completely', () => {
    let brehonContract;
    return BrehonContract.deployed()
      .then(function captureReference(instance) {
        brehonContract = instance;
        return instance;
      })
      .then(startContractAndRaiseDispute(
        [{
          addr: defaults.partyB_addr,
          value: getMinimumContractAmt(defaults),
        }], defaults.partyB_addr, defaults.partyB_addr))
      .then(function adjudicate() {
        return brehonContract.adjudicate(
          getSplitForPrimaryBrehon(0),
          getSplitForPrimaryBrehon(100),
          { from: defaults.primaryBrehon_addr });
      })
      .then(function verifyStage() {
        return brehonContract.stage.call().then((stage) => {
          assert.equal(stage.valueOf(), 4, 'stage is not set to Stages.AppealPeriod');
        });
      })
      .then(function verifyPartyBSplit() {
        return brehonContract.getActiveJudgmentByParty.call(defaults.partyB_addr).then((award) => {
          assert.equal(award.valueOf(), getSplitForPrimaryBrehon(100), 'Award for partyB not accurately set');
        });
      })
      .then(function verifyPartyASplit() {
        return brehonContract.getActiveJudgmentByParty.call(defaults.partyA_addr).then((award) => {
          assert.equal(award.valueOf(), getSplitForPrimaryBrehon(0), 'Award for partyA not accurately set');
        });
      })
      .catch(function handleException(err) {
        assert.isNull(err, 'Exception was thrown when primaryBrehon tried to adjudicate a dispute');
      });
  });
});

contract('BrehonContract should allow primaryBrehon to adjudicate the contract', () => {
  it('by rendering a partial judgment', () => {
    let brehonContract;
    return BrehonContract.deployed()
      .then(function captureReference(instance) {
        brehonContract = instance;
        return instance;
      })
      .then(startContractAndRaiseDispute(
        [{
          addr: defaults.partyB_addr,
          value: getMinimumContractAmt(defaults),
        }], defaults.partyB_addr, defaults.partyB_addr))
      .then(function adjudicate() {
        return brehonContract.adjudicate(
          getSplitForPrimaryBrehon(50),
          getSplitForPrimaryBrehon(-50),
          { from: defaults.primaryBrehon_addr });
      })
      .then(function verifyStage() {
        return brehonContract.stage.call().then((stage) => {
          assert.equal(stage.valueOf(), 4, 'stage is not set to Stages.AppealPeriod');
        });
      })
      .then(function verifyPartyBSplit() {
        return brehonContract.getActiveJudgmentByParty.call(defaults.partyB_addr).then((award) => {
          assert.equal(award.valueOf(), getSplitForPrimaryBrehon(-50), 'Award for partyB not accurately set');
        });
      })
      .then(function verifyPartyASplit() {
        return brehonContract.getActiveJudgmentByParty.call(defaults.partyA_addr).then((award) => {
          assert.equal(award.valueOf(), getSplitForPrimaryBrehon(50), 'Award for partyA not accurately set');
        });
      })
      .catch(function handleException(err) {
        assert.isNull(err, 'Exception was thrown when primaryBrehon tried to adjudicate a dispute');
      });
  });
});

contract('BrehonContract should not allow primaryBrehon to adjudicate the contract', () => {
  it('if the awards don\'t add up to full amount', () => {
    let brehonContract;
    return BrehonContract.deployed()
      .then(function captureReference(instance) {
        brehonContract = instance;
        return instance;
      })
      .then(startContractAndRaiseDispute(
        [{
          addr: defaults.partyA_addr,
          value: getMinimumContractAmt(defaults),
        }], defaults.partyA_addr, defaults.partyA_addr))
      .then(function adjudicate() {
        return brehonContract.adjudicate(
          getSplitForPrimaryBrehon(60),
          getSplitForPrimaryBrehon(60),
          { from: defaults.primaryBrehon_addr });
      })
      .catch(function handleException(err) {
        assert.isNotNull(err, 'Exception was not thrown when primaryBrehon tried to award more funds than the contract held');
      });
  });
});

contract('BrehonContract adjudication should only be allowed at Dispute stage', () => {
  it('by preventing it from being called at Negotiation stage', () => {
    let brehonContract;
    return BrehonContract.deployed()
      .then(function captureReference(instance) {
        brehonContract = instance;
        return instance;
      })
      .then(function adjudicate() {
        return brehonContract.adjudicate(
          getSplitForPrimaryBrehon(60),
          getSplitForPrimaryBrehon(60),
          { from: defaults.primaryBrehon_addr });
      })
      .catch((err) => {
        assert.isNotNull(err, 'Exception was not thrown when adjudicate() was triggerred at the Negotiation stage');
      });
  });

  it('by preventing it from being raised at Execution stage', () => {
    let brehonContract;
    return BrehonContract.deployed()
      .then(function captureReference(instance) {
        brehonContract = instance;
        return instance;
      })
      .then(startContract(
        [{
          addr: defaults.partyA_addr,
          value: getMinimumContractAmt(defaults),
        }], defaults.partyA_addr))
      .then(function adjudicate() {
        return brehonContract.adjudicate(
          getSplitForPrimaryBrehon(60),
          getSplitForPrimaryBrehon(60),
          { from: defaults.primaryBrehon_addr });
      })
      .catch((err) => {
        assert.isNotNull(err, 'Exception was not thrown when adjudicate was triggerred at the Execution stage');
      });
  });
});
