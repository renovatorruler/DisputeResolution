const R = require('ramda');

const BrehonContract = artifacts.require('./BrehonContract.sol');
const defaults = require('../config/deployment_settings.js').defaults;

const contractHelpers = require('../lib/contractHelpers.js');

const startContract = contractHelpers.startContract;
const assertError = contractHelpers.assertError;
const StagesEnum = contractHelpers.StagesEnum;
const startContractAndRaiseDispute = contractHelpers.startContractAndRaiseDispute;
const verifyEvent = contractHelpers.verifyEvent;
const getMinimumContractAmt = contractHelpers.getMinimumContractAmt;
const getSplitForPrimaryBrehon = contractHelpers.getPercentageSplit(defaults, 0);

const ResolutionStruct = {
  proposerAddr: 0,
  awardPartyA: 1,
  awardPartyB: 2,
  partyAAccepted: 3,
  partyBAccepted: 4,
};

/**
 * Spec:
 * + Must use verifyEvent method
 * + Error verification should happen via assertError
 * - Must check for all stages
 **/

/**
contract('BrehonContract proposeSettlement should only be allowed at one of the conflict stages', (accounts) => {
  const settlement = {
    'partyA': getSplitForPrimaryBrehon(50),
    'partyB': getSplitForPrimaryBrehon(50)
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
          {from: defaults.partyA_addr}
        );
      })
      .catch(assertError('Exception was not thrown when proposeSettlement was triggered at Negotiation stage'));
  });

  it('by preventing it from being called at Execution stage', () => {
    var brehonContract;
    return BrehonContract.deployed()
      .then(function captureReference(instance) {
        brehonContract = instance;
        return instance;
      })
      .then(startContract(
        [{
          addr: defaults.partyA_addr,
          value: getMinimumContractAmt(defaults)
        }], defaults.partyA_addr))
      .then(function proposeSettlement() {
        return brehonContract.proposeSettlement(
          settlement.partyA,
          settlement.partyB,
          {from: defaults.partyA_addr}
        );
      })
      .catch(assertError('Exception was not thrown when proposeSettlement was triggered at Execution stage'));
  });

  //TODO Add test for Resolved state
  it('by preventing it from being called at ', () => {
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
      .then(function raise2ndAppeal() {
        return brehonContract.raiseAppeal(
            {from: defaults.partyA_addr}
        );
      })
      .catch((err) => {
        assert.isNotNull(err, "Exception was not thrown when raiseAppeal() was triggerred at the AppealPeriod stage");
      });
  });
});
   **/

contract('BrehonContract should allow partyA to accepted a proposed settlement', (accounts) => {
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
          { from: defaults.partyB_addr }
        );
      })
      .then(function acceptSettlement() {
        return brehonContract.acceptSettlement(
          settlement.partyA,
          settlement.partyB,
          { from: defaults.partyA_addr }
        );
      })
      .then(verifyEvent('DisputeResolved', {
        '_awardPartyA': settlement.partyA,
        '_awardPartyB': settlement.partyB,
      }))
      .then(function verifyDisputeResolution() {
        return brehonContract.stage.call().then((stage) => {
          assert.equal(stage, StagesEnum.Completed, 'acceptSettlement not correctly changed the state');
        });
      })
      .catch(function handleException(err) {
        console.log(err);
        assert.isNull(err, 'Exception was thrown when partyA tried to accept settlement');
      });
  });
});

contract('BrehonContract should allow partyB to accepted a proposed settlement', (accounts) => {
  const settlement = {
    'partyA': getSplitForPrimaryBrehon(40),
    'partyB': getSplitForPrimaryBrehon(60)
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
      .then(function acceptSettlement() {
        return brehonContract.acceptSettlement(
          settlement.partyA,
          settlement.partyB,
          { from: defaults.partyB_addr }
        );
      })
      .then(verifyEvent('DisputeResolved', {
        '_awardPartyA': settlement.partyA,
        '_awardPartyB': settlement.partyB,
      }))
      .then(function verifyDisputeResolution() {
        return brehonContract.stage.call().then((stage) => {
          assert.equal(stage, StagesEnum.Completed, 'acceptSettlement not correctly changed the state');
        });
      })
      .catch(function handleException(err) {
        console.log(err);
        assert.isNull(err, 'Exception was thrown when partyA tried to accept settlement');
      });
  });
});
