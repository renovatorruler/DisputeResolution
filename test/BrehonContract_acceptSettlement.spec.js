const BrehonContract = artifacts.require('./BrehonContract.sol');
const defaults = require('../config/deployment_settings.js').defaults;

const contractHelpers = require('../lib/contractHelpers.js');

const startContract = contractHelpers.startContract;
const raiseDispute = contractHelpers.raiseDispute;
const assertError = contractHelpers.assertError;
const assertNoError = contractHelpers.assertNoError;
const assertNoErrorWithMsg = assertNoError('No Exception must be thrown');
const StagesEnum = contractHelpers.StagesEnum;
const startContractAndRaiseDispute = contractHelpers.startContractAndRaiseDispute;
const verifyEvent = contractHelpers.verifyEvent;
const getMinimumContractAmt = contractHelpers.getMinimumContractAmt;
const getSplitForPrimaryBrehon = contractHelpers.getPercentageSplit(defaults, 0);

/**
 * Spec:
 * + Must use verifyEvent method
 * + Error verification should happen via assertError
 * - Must check for all stages
 **/

contract('BrehonContract acceptSettlement should only be allowed at one of the conflict stages', () => {
  const settlement = {
    partyA: getSplitForPrimaryBrehon(50),
    partyB: getSplitForPrimaryBrehon(50),
  };
  it('by preventing it from being called at Negotiation stage', () => {
    let brehonContract;
    return BrehonContract.deployed()
      .then(function captureReference(instance) {
        brehonContract = instance;
        return instance;
      })
      .then(function acceptSettlement() {
        return brehonContract.acceptSettlement(
          settlement.partyA,
          settlement.partyB,
          { from: defaults.partyA_addr });
      })
      .catch(assertError('Exception was not thrown when acceptSettlement was triggered at Negotiation stage'));
  });
});

contract('BrehonContract acceptSettlement should only be allowed at one of the conflict stages', () => {
  const settlement = {
    partyA: getSplitForPrimaryBrehon(50),
    partyB: getSplitForPrimaryBrehon(50),
  };
  it('by preventing it from being called at Execution stage', () => {
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
      .catch(assertNoErrorWithMsg)
      .then(function proposeSettlement() {
        return brehonContract.proposeSettlement(
          settlement.partyA,
          settlement.partyB,
          { from: defaults.partyA_addr });
      })
      .catch(assertError('Exception was not thrown when acceptSettlement was triggered at Execution stage'));
  });

  it('by preventing it from being called at Completed stage', () => {
    let brehonContract;
    return BrehonContract.deployed()
      .then(function captureReference(instance) {
        brehonContract = instance;
        return instance;
      })
      .then(raiseDispute(defaults.partyA_addr))
      .catch(assertNoErrorWithMsg)
      .then(function proposeSettlement() {
        return brehonContract.proposeSettlement(
          settlement.partyA,
          settlement.partyB,
          { from: defaults.partyB_addr });
      })
      .catch(assertNoErrorWithMsg)
      .then(function acceptSettlement() {
        return brehonContract.acceptSettlement(
          settlement.partyA,
          settlement.partyB,
          { from: defaults.partyA_addr });
      })
      .catch(assertNoErrorWithMsg)
      .then(function acceptSettlement() {
        return brehonContract.acceptSettlement(
          settlement.partyA,
          settlement.partyB,
          { from: defaults.partyA_addr });
      })
      .catch(assertError('Exception was not thrown when raiseAppeal() was triggerred at the AppealPeriod stage'));
  });
});

contract('BrehonContract should allow partyA to accepted a proposed settlement', () => {
  const settlement = {
    partyA: getSplitForPrimaryBrehon(60),
    partyB: getSplitForPrimaryBrehon(40),
  };
  it('at Dispute stage', () => {
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
      .catch(assertNoErrorWithMsg)
      .then(function proposeSettlement() {
        return brehonContract.proposeSettlement(
          settlement.partyA,
          settlement.partyB,
          { from: defaults.partyB_addr });
      })
      .catch(assertNoErrorWithMsg)
      .then(function acceptSettlement() {
        return brehonContract.acceptSettlement(
          settlement.partyA,
          settlement.partyB,
          { from: defaults.partyA_addr });
      })
      .then(verifyEvent('DisputeResolved', {
        _awardPartyA: settlement.partyA,
        _awardPartyB: settlement.partyB,
      }))
      .then(function verifyAwards() {
        return brehonContract.getActiveJudgmentByParty.call(defaults.partyA_addr,
          { from: defaults.partyA_addr }).then((award) => {
            assert.equal(award.valueOf(), settlement.partyA.valueOf(), 'acceptSettlement did not correctly set the award');
          });
      })
      .then(function verifyAwards() {
        return brehonContract.getActiveJudgmentByParty.call(defaults.partyB_addr,
          { from: defaults.partyB_addr }).then((award) => {
            assert.equal(award.valueOf(), settlement.partyB.valueOf(), 'acceptSettlement did not correctly set the award');
          });
      })
      .then(function verifyDisputeResolution() {
        return brehonContract.stage.call().then((stage) => {
          assert.equal(stage, StagesEnum.Completed, 'acceptSettlement not correctly changed the state');
        });
      })
      .catch(function handleException(err) {
        console.error(err);
        assert.isNull(err, 'Exception was thrown when partyA tried to accept settlement');
      });
  });
});

contract('BrehonContract should allow partyB to accepted a proposed settlement', () => {
  const settlement = {
    partyA: getSplitForPrimaryBrehon(40),
    partyB: getSplitForPrimaryBrehon(60),
  };
  it('at Dispute stage', () => {
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
      .catch(assertNoErrorWithMsg)
      .then(function proposeSettlement() {
        return brehonContract.proposeSettlement(
          settlement.partyA,
          settlement.partyB,
          { from: defaults.partyA_addr });
      })
      .catch(assertNoErrorWithMsg)
      .then(function acceptSettlement() {
        return brehonContract.acceptSettlement(
          settlement.partyA,
          settlement.partyB,
          { from: defaults.partyB_addr });
      })
      .then(verifyEvent('DisputeResolved', {
        _awardPartyA: settlement.partyA,
        _awardPartyB: settlement.partyB,
      }))
      .then(function verifyDisputeResolution() {
        return brehonContract.stage.call().then((stage) => {
          assert.equal(stage, StagesEnum.Completed, 'acceptSettlement not correctly changed the state');
        });
      })
      .catch(function handleException(err) {
        console.error(err);
        assert.isNull(err, 'Exception was thrown when partyA tried to accept settlement');
      });
  });
});
