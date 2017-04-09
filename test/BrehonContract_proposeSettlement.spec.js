const BrehonContract = artifacts.require('./BrehonContract.sol');
const defaults = require('../config/deployment_settings.js').defaults;

const contractHelpers = require('../lib/contractHelpers.js');

const startContract = contractHelpers.startContract;
const assertError = contractHelpers.assertError;
const startContractAndRaiseDispute = contractHelpers.startContractAndRaiseDispute;
const verifyEvent = contractHelpers.verifyEvent;
const getMinimumContractAmt = contractHelpers.getMinimumContractAmt;
const getSplitForPrimaryBrehon = contractHelpers.getPercentageSplit(defaults, 0);
const ResolutionStruct = contractHelpers.ResolutionStruct;

/**
 * Spec:
 * + Must use verifyEvent method
 * + Error verification should happen via assertError
 * - Must check for all stages
 **/

contract('BrehonContract proposeSettlement should only be allowed at one of the conflict stages',
  () => {
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
        .then(function proposeSettlement() {
          return brehonContract.proposeSettlement(
            settlement.partyA,
            settlement.partyB,
            { from: defaults.partyA_addr });
        })
        .catch(assertError('Exception was not thrown when proposeSettlement was triggered at Negotiation stage'));
    });

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
        .then(function proposeSettlement() {
          return brehonContract.proposeSettlement(
            settlement.partyA,
            settlement.partyB,
            { from: defaults.partyA_addr });
        })
        .catch(assertError('Exception was not thrown when proposeSettlement was triggered at Execution stage'));
    });

    // TODO Add test for Resolved state
    /**
    it('by preventing it from being called at ', () => {
      let brehonContract;
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
            { from: defaults.primaryBrehon_addr }
          );
        })
        .then(function raise2ndAppeal() {
          return brehonContract.raiseAppeal(
            { from: defaults.partyA_addr }
          );
        })
        .catch((err) => {
          assert.isNotNull(err,
            'Exception was not thrown when raiseAppeal() was triggerred at the AppealPeriod stage');
        });
    });
    **/
  });

contract('BrehonContract should allow partyA to propose a settlement', () => {
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
      .then(function proposeSettlement() {
        return brehonContract.proposeSettlement(
          settlement.partyA,
          settlement.partyB,
          { from: defaults.partyA_addr });
      })
      .then(verifyEvent('SettlementProposed', {
        _proposingParty: defaults.partyA_addr,
        _awardPartyA: settlement.partyA,
        _awardPartyB: settlement.partyB,
      }))
      .then(function verifySettlementRecord() {
        return brehonContract.proposedSettlement.call().then((proposedSettlement) => {
          assert.equal(proposedSettlement[ResolutionStruct.awardPartyA].valueOf(),
            settlement.partyA.valueOf(), 'proposedSettlement not recorded correctly for partyA');
          assert.equal(proposedSettlement[ResolutionStruct.awardPartyB].valueOf(),
            settlement.partyB.valueOf(), 'proposedSettlement not recorded correctly for partyB');
          assert.equal(proposedSettlement[ResolutionStruct.proposerAddr],
            defaults.partyA_addr, 'proposedSettlement\'s proposer address not recorded correctly');
          assert.equal(proposedSettlement[ResolutionStruct.partyAAccepted],
            true, 'proposedSettlement should set calling party\'s acceptance to true');
          assert.equal(proposedSettlement[ResolutionStruct.partyBAccepted],
            false, 'proposedSettlement should set non-calling party\'s acceptance to false');
        });
      })
      .catch(function handleException(err) {
        console.error(err);
        assert.isNull(err, 'Exception was thrown when partyA tried to raise an appeal');
      });
  });
});

contract('BrehonContract should allow partyB to propose a settlement', () => {
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
      .then(function proposeSettlement() {
        return brehonContract.proposeSettlement(
          settlement.partyA,
          settlement.partyB,
          { from: defaults.partyB_addr });
      })
      .then(verifyEvent('SettlementProposed', {
        _proposingParty: defaults.partyB_addr,
        _awardPartyA: settlement.partyA,
        _awardPartyB: settlement.partyB,
      }))
      .then(function verifySettlementRecord() {
        return brehonContract.proposedSettlement.call().then((proposedSettlement) => {
          assert.equal(proposedSettlement[ResolutionStruct.awardPartyA].valueOf(),
            settlement.partyA.valueOf(), 'proposedSettlement not recorded correctly for partyA');
          assert.equal(proposedSettlement[ResolutionStruct.awardPartyB].valueOf(),
            settlement.partyB.valueOf(), 'proposedSettlement not recorded correctly for partyB');
          assert.equal(proposedSettlement[ResolutionStruct.proposerAddr],
            defaults.partyB_addr, 'proposedSettlement\'s proposer address not recorded correctly');
          assert.equal(proposedSettlement[ResolutionStruct.partyAAccepted],
            false, 'proposedSettlement should set calling party\'s acceptance to true');
          assert.equal(proposedSettlement[ResolutionStruct.partyBAccepted],
            true, 'proposedSettlement should set non-calling party\'s acceptance to false');
        });
      })
      .catch(function handleException(err) {
        console.error(err);
        assert.isNull(err, 'Exception was thrown when partyA tried to raise an appeal');
      });
  });
});
