const BrehonContract = artifacts.require('./BrehonContract.sol');

const defaults = require('../config/deployment_settings.js').defaults;
const contractHelpers = require('../lib/contractHelpers.js');

const startContract = contractHelpers.startContract;
const startContractAndRaiseDispute = contractHelpers.startContractAndRaiseDispute;
const getMinimumContractAmt = contractHelpers.getMinimumContractAmt;
const assertNoError = contractHelpers.assertNoError(true);
const getSplitForPrimaryBrehon = contractHelpers.getPercentageSplit(defaults, 0);
const getSplitForSecondaryBrehon = contractHelpers.getPercentageSplit(defaults, 1);
const getSplitForTertiaryBrehon = contractHelpers.getPercentageSplit(defaults, 2);
const StagesStruct = contractHelpers.StagesStruct;

// primaryBrehon Tests
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
      .catch(assertNoError('No Exception must be thrown after raiseDispute'))
      .then(function adjudicate() {
        return brehonContract.adjudicate(
          getSplitForPrimaryBrehon(100),
          getSplitForPrimaryBrehon(0),
          { from: defaults.primaryBrehon_addr });
      })
      .then(function verifyStage() {
        return brehonContract.stage.call().then((stage) => {
          assert.equal(stage.valueOf(), StagesStruct.AppealPeriod, 'stage is not set to Stages.AppealPeriod');
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
      .catch(assertNoError('No Exception must be thrown after raiseDispute'))
      .then(function adjudicate() {
        return brehonContract.adjudicate(
          getSplitForPrimaryBrehon(0),
          getSplitForPrimaryBrehon(100),
          { from: defaults.primaryBrehon_addr });
      })
      .then(function verifyStage() {
        return brehonContract.stage.call().then((stage) => {
          assert.equal(stage.valueOf(), StagesStruct.AppealPeriod, 'stage is not set to Stages.AppealPeriod');
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
      .catch(assertNoError('No Exception must be thrown after raiseDispute'))
      .then(function adjudicate() {
        return brehonContract.adjudicate(
          getSplitForPrimaryBrehon(50),
          getSplitForPrimaryBrehon(-50),
          { from: defaults.primaryBrehon_addr });
      })
      .then(function verifyStage() {
        return brehonContract.stage.call().then((stage) => {
          assert.equal(stage.valueOf(), StagesStruct.AppealPeriod, 'stage is not set to Stages.AppealPeriod');
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
      .catch(assertNoError('No Exception must be thrown after raiseDispute'))
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

contract('BrehonContract should allow only primaryBrehon to adjudicate the contract when contract is in Dispute stage', () => {
  it('by preventing secondaryBrehon from adjudicating', () => {
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
      .catch(assertNoError('No Exception must be thrown after raiseDispute'))
      .then(function adjudicate() {
        return brehonContract.adjudicate(
          getSplitForSecondaryBrehon(100),
          getSplitForSecondaryBrehon(0),
          { from: defaults.secondaryBrehon_addr });
      })
      .catch(function handleException(err) {
        assert.isNotNull(err, 'Exception was not thrown when secondaryBrehon tried to adjudicate during Dispute stage');
      });
  });
});

contract('BrehonContract should allow only primaryBrehon to adjudicate the contract when contract is in Dispute stage', () => {
  it('by preventing tertiaryBrehon from adjudicating', () => {
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
      .catch(assertNoError('No Exception must be thrown after raiseDispute'))
      .then(function adjudicate() {
        return brehonContract.adjudicate(
          getSplitForTertiaryBrehon(100),
          getSplitForTertiaryBrehon(0),
          { from: defaults.tertiaryBrehon_addr });
      })
      .catch(function handleException(err) {
        assert.isNotNull(err, 'Exception was not thrown when tertiaryBrehon tried to adjudicate during Dispute stage');
      });
  });
});

// secondaryBrehon Tests
contract('BrehonContract should allow secondaryBrehon to adjudicate the contract', () => {
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
      .catch(assertNoError('No Exception must be thrown after raiseDispute'))
      .then(function adjudicatePrimaryBrehon() {
        return brehonContract.adjudicate(
          getSplitForPrimaryBrehon(100),
          getSplitForPrimaryBrehon(0),
          { from: defaults.primaryBrehon_addr });
      })
      .catch(assertNoError('No Exception must be thrown after primaryBrehon\'s adjudicate'))
      .then(function raiseAppeal() {
        return brehonContract.raiseAppeal({ from: defaults.partyB_addr });
      })
      .then(function adjudicate() {
        return brehonContract.adjudicate(
            getSplitForSecondaryBrehon(100),
            getSplitForSecondaryBrehon(0),
            { from: defaults.secondaryBrehon_addr });
      })
      .then(function verifyStage() {
        return brehonContract.stage.call().then((stage) => {
          assert.equal(stage.valueOf(), StagesStruct.SecondAppealPeriod, 'stage is not set to Stages.SecondAppealPeriod');
        });
      })
      .then(function verifyPartyASplit() {
        return brehonContract.getActiveJudgmentByParty.call(defaults.partyA_addr).then((award) => {
          assert.equal(award.valueOf(), getSplitForSecondaryBrehon(100), 'Award for partyA not accurately set');
        });
      })
      .then(function verifyPartyBSplit() {
        return brehonContract.getActiveJudgmentByParty.call(defaults.partyB_addr).then((award) => {
          assert.equal(award.valueOf(), getSplitForSecondaryBrehon(0), 'Award for partyB not accurately set');
        });
      })
      .catch(function handleException(err) {
        console.error(err);
        assert.isNull(err, 'Exception was thrown when primaryBrehon tried to adjudicate a dispute');
      });
  });
});

contract('BrehonContract should allow secondaryBrehon to adjudicate the contract', () => {
  it('in the favor of partyB completely', () => {
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
      .catch(assertNoError('No Exception must be thrown after raiseDispute'))
      .then(function adjudicatePrimaryBrehon() {
        return brehonContract.adjudicate(
          getSplitForPrimaryBrehon(0),
          getSplitForPrimaryBrehon(100),
          { from: defaults.primaryBrehon_addr });
      })
      .catch(assertNoError('No Exception must be thrown after primaryBrehon\'s adjudicate'))
      .then(function raiseAppeal() {
        return brehonContract.raiseAppeal({ from: defaults.partyA_addr });
      })
      .then(function adjudicate() {
        return brehonContract.adjudicate(
            getSplitForSecondaryBrehon(0),
            getSplitForSecondaryBrehon(100),
            { from: defaults.secondaryBrehon_addr });
      })
      .then(function verifyStage() {
        return brehonContract.stage.call().then((stage) => {
          assert.equal(stage.valueOf(), StagesStruct.SecondAppealPeriod, 'stage is not set to Stages.SecondAppealPeriod');
        });
      })
      .then(function verifyPartyASplit() {
        return brehonContract.getActiveJudgmentByParty.call(defaults.partyA_addr).then((award) => {
          assert.equal(award.valueOf(), getSplitForSecondaryBrehon(0), 'Award for partyA not accurately set');
        });
      })
      .then(function verifyPartyBSplit() {
        return brehonContract.getActiveJudgmentByParty.call(defaults.partyB_addr).then((award) => {
          assert.equal(award.valueOf(), getSplitForSecondaryBrehon(100), 'Award for partyB not accurately set');
        });
      })
      .catch(function handleException(err) {
        console.error(err);
        assert.isNull(err, 'Exception was thrown when primaryBrehon tried to adjudicate a dispute');
      });
  });
});

contract('BrehonContract should allow secondaryBrehon to adjudicate the contract', () => {
  it('by rendering a partial judgment', () => {
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
      .catch(assertNoError('No Exception must be thrown after raiseDispute'))
      .then(function adjudicatePrimaryBrehon() {
        return brehonContract.adjudicate(
          getSplitForPrimaryBrehon(50),
          getSplitForPrimaryBrehon(-50),
          { from: defaults.primaryBrehon_addr });
      })
      .catch(assertNoError('No Exception must be thrown after primaryBrehon\'s adjudicate'))
      .then(function raiseAppeal() {
        return brehonContract.raiseAppeal({ from: defaults.partyB_addr });
      })
      .then(function adjudicate() {
        return brehonContract.adjudicate(
            getSplitForSecondaryBrehon(50),
            getSplitForSecondaryBrehon(-50),
            { from: defaults.secondaryBrehon_addr });
      })
      .then(function verifyStage() {
        return brehonContract.stage.call().then((stage) => {
          assert.equal(stage.valueOf(), StagesStruct.SecondAppealPeriod, 'stage is not set to Stages.SecondAppealPeriod');
        });
      })
      .then(function verifyPartyASplit() {
        return brehonContract.getActiveJudgmentByParty.call(defaults.partyA_addr).then((award) => {
          assert.equal(award.valueOf(), getSplitForSecondaryBrehon(50), 'Award for partyA not accurately set');
        });
      })
      .then(function verifyPartyBSplit() {
        return brehonContract.getActiveJudgmentByParty.call(defaults.partyB_addr).then((award) => {
          assert.equal(award.valueOf(), getSplitForSecondaryBrehon(-50), 'Award for partyB not accurately set');
        });
      })
      .catch(function handleException(err) {
        console.error(err);
        assert.isNull(err, 'Exception was thrown when primaryBrehon tried to adjudicate a dispute');
      });
  });
});

contract('BrehonContract should allow only secondaryBrehon to adjudicate the contract when contract is in Appeal stage', () => {
  it('by preventing primaryBrehon from adjudicating', () => {
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
      .catch(assertNoError('No Exception must be thrown after raiseDispute'))
      .then(function adjudicatePrimaryBrehon() {
        return brehonContract.adjudicate(
          getSplitForPrimaryBrehon(50),
          getSplitForPrimaryBrehon(-50),
          { from: defaults.primaryBrehon_addr });
      })
      .catch(assertNoError('No Exception must be thrown after primaryBrehon\'s adjudicate'))
      .then(function raiseAppeal() {
        return brehonContract.raiseAppeal({ from: defaults.partyA_addr });
      })
      .catch(assertNoError('No Exception must be thrown after raiseAppeal'))
      .then(function adjudicate() {
        return brehonContract.adjudicate(
          getSplitForPrimaryBrehon(100),
          getSplitForPrimaryBrehon(0),
          { from: defaults.primaryBrehon_addr });
      })
      .catch(function handleException(err) {
        assert.isNotNull(err, 'Exception was not thrown when primaryBrehon tried to adjudicate during Appeal stage');
      });
  });
});

contract('BrehonContract should allow only secondaryBrehon to adjudicate the contract when contract is in Appeal stage', () => {
  it('by preventing tertiaryBrehon from adjudicating', () => {
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
      .catch(assertNoError('No Exception must be thrown after raiseDispute'))
      .then(function adjudicatePrimaryBrehon() {
        return brehonContract.adjudicate(
          getSplitForPrimaryBrehon(50),
          getSplitForPrimaryBrehon(-50),
          { from: defaults.primaryBrehon_addr });
      })
      .catch(assertNoError('No Exception must be thrown after primaryBrehon\'s adjudicate'))
      .then(function raiseAppeal() {
        return brehonContract.raiseAppeal({ from: defaults.partyA_addr });
      })
      .catch(assertNoError('No Exception must be thrown after raiseAppeal'))
      .then(function adjudicate() {
        return brehonContract.adjudicate(
          getSplitForTertiaryBrehon(100),
          getSplitForTertiaryBrehon(0),
          { from: defaults.tertiaryBrehon_addr });
      })
      .catch(function handleException(err) {
        assert.isNotNull(err, 'Exception was not thrown when tertiaryBrehon tried to adjudicate during Appeal stage');
      });
  });
});

// tertiaryBrehon Tests
contract('BrehonContract should allow tertiaryBrehon to adjudicate the contract', () => {
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
      .catch(assertNoError('No Exception must be thrown after raiseDispute'))
      .then(function adjudicatePrimaryBrehon() {
        return brehonContract.adjudicate(
          getSplitForPrimaryBrehon(100),
          getSplitForPrimaryBrehon(0),
          { from: defaults.primaryBrehon_addr });
      })
      .catch(assertNoError('No Exception must be thrown after primaryBrehon\'s adjudicate'))
      .then(function raiseAppeal() {
        return brehonContract.raiseAppeal({ from: defaults.partyB_addr });
      })
      .catch(assertNoError('No Exception must be thrown after raiseAppeal'))
      .then(function adjudicate() {
        return brehonContract.adjudicate(
            getSplitForSecondaryBrehon(0),
            getSplitForSecondaryBrehon(100),
            { from: defaults.secondaryBrehon_addr });
      })
      .catch(assertNoError('No Exception must be thrown after second brehon\'s adjudicate'))
      .then(function raise2ndAppeal() {
        return brehonContract.raise2ndAppeal({ from: defaults.partyA_addr });
      })
      .catch(assertNoError('No Exception must be thrown after second appeal is raised'))
      .then(function adjudicate() {
        return brehonContract.adjudicate(
            getSplitForTertiaryBrehon(100),
            getSplitForTertiaryBrehon(0),
            { from: defaults.tertiaryBrehon_addr });
      })
      .then(function verifyStage() {
        return brehonContract.stage.call().then((stage) => {
          assert.equal(stage.valueOf(), StagesStruct.Completed, 'stage is not set to Stages.Completed');
        });
      })
      .then(function verifyPartyASplit() {
        return brehonContract.getActiveJudgmentByParty.call(defaults.partyA_addr).then((award) => {
          assert.equal(award.valueOf(), getSplitForTertiaryBrehon(100), 'Award for partyA not accurately set');
        });
      })
      .then(function verifyPartyBSplit() {
        return brehonContract.getActiveJudgmentByParty.call(defaults.partyB_addr).then((award) => {
          assert.equal(award.valueOf(), getSplitForTertiaryBrehon(0), 'Award for partyB not accurately set');
        });
      })
      .catch(function handleException(err) {
        console.error(err);
        assert.isNull(err, 'Exception was thrown when tertiaryBrehon tried to adjudicate a dispute');
      });
  });
});

contract('BrehonContract should allow tertiaryBrehon to adjudicate the contract', () => {
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
        }], defaults.partyA_addr, defaults.partyA_addr))
      .catch(assertNoError('No Exception must be thrown after raiseDispute'))
      .then(function adjudicatePrimaryBrehon() {
        return brehonContract.adjudicate(
          getSplitForPrimaryBrehon(0),
          getSplitForPrimaryBrehon(100),
          { from: defaults.primaryBrehon_addr });
      })
      .catch(assertNoError('No Exception must be thrown after primaryBrehon\'s adjudicate'))
      .then(function raiseAppeal() {
        return brehonContract.raiseAppeal({ from: defaults.partyA_addr });
      })
      .catch(assertNoError('No Exception must be thrown after raiseAppeal'))
      .then(function adjudicate() {
        return brehonContract.adjudicate(
            getSplitForSecondaryBrehon(100),
            getSplitForSecondaryBrehon(0),
            { from: defaults.secondaryBrehon_addr });
      })
      .catch(assertNoError('No Exception must be thrown after second brehon\'s adjudicate'))
      .then(function raise2ndAppeal() {
        return brehonContract.raise2ndAppeal({ from: defaults.partyB_addr });
      })
      .catch(assertNoError('No Exception must be thrown after second appeal is raised'))
      .then(function adjudicate() {
        return brehonContract.adjudicate(
            getSplitForTertiaryBrehon(0),
            getSplitForTertiaryBrehon(100),
            { from: defaults.tertiaryBrehon_addr });
      })
      .then(function verifyStage() {
        return brehonContract.stage.call().then((stage) => {
          assert.equal(stage.valueOf(), StagesStruct.Completed, 'stage is not set to Stages.Completed');
        });
      })
      .then(function verifyPartyASplit() {
        return brehonContract.getActiveJudgmentByParty.call(defaults.partyA_addr).then((award) => {
          assert.equal(award.valueOf(), getSplitForTertiaryBrehon(0), 'Award for partyA not accurately set');
        });
      })
      .then(function verifyPartyBSplit() {
        return brehonContract.getActiveJudgmentByParty.call(defaults.partyB_addr).then((award) => {
          assert.equal(award.valueOf(), getSplitForTertiaryBrehon(100), 'Award for partyB not accurately set');
        });
      })
      .catch(function handleException(err) {
        console.error(err);
        assert.isNull(err, 'Exception was thrown when tertiaryBrehon tried to adjudicate a dispute');
      });
  });
});

contract('BrehonContract should allow tertiaryBrehon to adjudicate the contract', () => {
  it('by rendering a partial judgment', () => {
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
      .catch(assertNoError('No Exception must be thrown after raiseDispute'))
      .then(function adjudicatePrimaryBrehon() {
        return brehonContract.adjudicate(
          getSplitForPrimaryBrehon(100),
          getSplitForPrimaryBrehon(0),
          { from: defaults.primaryBrehon_addr });
      })
      .catch(assertNoError('No Exception must be thrown after primaryBrehon\'s adjudicate'))
      .then(function raiseAppeal() {
        return brehonContract.raiseAppeal({ from: defaults.partyB_addr });
      })
      .catch(assertNoError('No Exception must be thrown after raiseAppeal'))
      .then(function adjudicate() {
        return brehonContract.adjudicate(
            getSplitForSecondaryBrehon(0),
            getSplitForSecondaryBrehon(100),
            { from: defaults.secondaryBrehon_addr });
      })
      .catch(assertNoError('No Exception must be thrown after second brehon\'s adjudicate'))
      .then(function raise2ndAppeal() {
        return brehonContract.raise2ndAppeal({ from: defaults.partyA_addr });
      })
      .catch(assertNoError('No Exception must be thrown after second appeal is raised'))
      .then(function adjudicate() {
        return brehonContract.adjudicate(
            getSplitForTertiaryBrehon(50),
            getSplitForTertiaryBrehon(-50),
            { from: defaults.tertiaryBrehon_addr });
      })
      .then(function verifyStage() {
        return brehonContract.stage.call().then((stage) => {
          assert.equal(stage.valueOf(), StagesStruct.Completed, 'stage is not set to Stages.Completed');
        });
      })
      .then(function verifyPartyASplit() {
        return brehonContract.getActiveJudgmentByParty.call(defaults.partyA_addr).then((award) => {
          assert.equal(award.valueOf(), getSplitForTertiaryBrehon(50), 'Award for partyA not accurately set');
        });
      })
      .then(function verifyPartyBSplit() {
        return brehonContract.getActiveJudgmentByParty.call(defaults.partyB_addr).then((award) => {
          assert.equal(award.valueOf(), getSplitForTertiaryBrehon(-50), 'Award for partyB not accurately set');
        });
      })
      .catch(function handleException(err) {
        console.error(err);
        assert.isNull(err, 'Exception was thrown when tertiaryBrehon tried to adjudicate a dispute');
      });
  });
});

contract('BrehonContract should allow only tertiaryBrehon to adjudicate the contract when contract is in SecondAppeal stage', () => {
  it('by preventing primaryBrehon from adjudicating', () => {
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
      .catch(assertNoError('No Exception must be thrown after raiseDispute'))
      .then(function adjudicatePrimaryBrehon() {
        return brehonContract.adjudicate(
          getSplitForPrimaryBrehon(50),
          getSplitForPrimaryBrehon(-50),
          { from: defaults.primaryBrehon_addr });
      })
      .catch(assertNoError('No Exception must be thrown after primaryBrehon\'s adjudicate'))
      .then(function raiseAppeal() {
        return brehonContract.raiseAppeal({ from: defaults.partyA_addr });
      })
      .catch(assertNoError('No Exception must be thrown after raiseAppeal'))
      .then(function adjudicate() {
        return brehonContract.adjudicate(
            getSplitForSecondaryBrehon(0),
            getSplitForSecondaryBrehon(100),
            { from: defaults.secondaryBrehon_addr });
      })
      .catch(assertNoError('No Exception must be thrown after second brehon\'s adjudicate'))
      .then(function raise2ndAppeal() {
        return brehonContract.raise2ndAppeal({ from: defaults.partyA_addr });
      })
      .catch(assertNoError('No Exception must be thrown after second appeal is raised'))
      .then(function adjudicate() {
        return brehonContract.adjudicate(
          getSplitForPrimaryBrehon(100),
          getSplitForPrimaryBrehon(0),
          { from: defaults.primaryBrehon_addr });
      })
      .catch(function handleException(err) {
        assert.isNotNull(err, `Exception was not thrown when primaryBrehon tried to adjudicate during SecondAppeal stage: ${err}`);
      });
  });
});

contract('BrehonContract should allow only tertiaryBrehon to adjudicate the contract when contract is in SecondAppeal stage', () => {
  it('by preventing secondaryBrehon from adjudicating', () => {
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
      .catch(assertNoError('No Exception must be thrown after raiseDispute'))
      .then(function adjudicatePrimaryBrehon() {
        return brehonContract.adjudicate(
          getSplitForPrimaryBrehon(50),
          getSplitForPrimaryBrehon(-50),
          { from: defaults.primaryBrehon_addr });
      })
      .catch(assertNoError('No Exception must be thrown after primaryBrehon\'s adjudicate'))
      .then(function raiseAppeal() {
        return brehonContract.raiseAppeal({ from: defaults.partyA_addr });
      })
      .catch(assertNoError('No Exception must be thrown after raiseAppeal'))
      .then(function adjudicate() {
        return brehonContract.adjudicate(
            getSplitForSecondaryBrehon(0),
            getSplitForSecondaryBrehon(100),
            { from: defaults.secondaryBrehon_addr });
      })
      .catch(assertNoError('No Exception must be thrown after second brehon\'s adjudicate'))
      .then(function raise2ndAppeal() {
        return brehonContract.raise2ndAppeal({ from: defaults.partyA_addr });
      })
      .catch(assertNoError('No Exception must be thrown after second appeal is raised'))
      .then(function adjudicate() {
        return brehonContract.adjudicate(
          getSplitForSecondaryBrehon(100),
          getSplitForSecondaryBrehon(0),
          { from: defaults.secondaryBrehon_addr });
      })
      .catch(function handleException(err) {
        assert.isNotNull(err, `Exception was not thrown when secondaryBrehon tried to adjudicate during SecondAppeal stage: ${err}`);
      });
  });
});
