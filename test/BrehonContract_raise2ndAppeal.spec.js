const R = require('ramda');
const BigNumber = require('bignumber.js');

const BrehonContract = require('../app/javascripts/BrehonAPI.js');
const defaults = require('../config/deployment_settings.js').defaults;

const contractHelpers = require('../lib/contractHelpers.js');

const assertError = contractHelpers.assertError;
const verifyEvent = contractHelpers.verifyEvent;
const startContract = contractHelpers.startContract;
const startContractAndRaiseDispute = contractHelpers.startContractAndRaiseDispute;
const getMinimumContractAmt = contractHelpers.getMinimumContractAmt;
const getSplitForPrimaryBrehon = contractHelpers.getPercentageSplit(defaults, 0);
const getSplitForSecondaryBrehon = contractHelpers.getPercentageSplit(defaults, 1);
const PartyStruct = contractHelpers.PartyStruct;
const BrehonStruct = contractHelpers.BrehonStruct;

/**
 * Spec:
 * + Must use verifyEvent method
 * + Error verification should happen via assertError
 * - Must check for all stages
 **/

contract('BrehonContract raiseAppeal should only be allowed at Dispute stage', (accounts) => {
  it('by preventing it from being called at Negotiation stage', () => {
    var brehonContract;
    return BrehonContract.deployed()
      .then(function captureReference(instance) {
        brehonContract = instance;
        return instance;
      })
      .then(function raise2ndAppeal() {
        return brehonContract.raise2ndAppeal(
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
      .then(function raise2ndAppeal() {
        return brehonContract.raise2ndAppeal(
            {from: defaults.partyA_addr}
        );
      })
      .catch(assertError('Exception was not thrown when proposeSettlement was triggered at Execution stage'));
  });

  it('by preventing it from being called at AppealPeriod stage with appealLevel == 1', () => {
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
      .catch(assertError("Exception was not thrown when raiseAppeal() was triggerred at the AppealPeriod stage"));
  });
});

contract('BrehonContract should not allow an unauthorized party to raise an appeal', (accounts) => {
  it('like the primaryBrehon', () => {
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
            {from: defaults.primaryBrehon_addr}
        );
      })
      .then(function adjudicate() {
        return brehonContract.adjudicate(
            getSplitForSecondaryBrehon(100),
            getSplitForSecondaryBrehon(0),
            {from: defaults.secondaryBrehon_addr}
        );
      })
      .then(function raise2ndAppeal() {
        return brehonContract.raiseAppeal(
            {from: defaults.primaryBrehon_addr}
        );
      })
      .catch(assertError("Exception was not thrown when primaryBrehon tried to raise an appeal"));
  });

  it('like the secondaryBrehon', () => {
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
            {from: defaults.secondaryBrehon_addr}
        );
      })
      .then(function adjudicate() {
        return brehonContract.adjudicate(
            getSplitForSecondaryBrehon(100),
            getSplitForSecondaryBrehon(0),
            {from: defaults.secondaryBrehon_addr}
        );
      })
      .then(function raise2ndAppeal() {
        return brehonContract.raiseAppeal(
            {from: defaults.primaryBrehon_addr}
        );
      })
      .catch(assertError("Exception was not thrown when secondaryBrehon tried to raise an appeal"));
  });

  it('like the tertiaryBrehon', () => {
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
            {from: defaults.tertiaryBrehon_addr}
        );
      })
      .then(function adjudicate() {
        return brehonContract.adjudicate(
            getSplitForSecondaryBrehon(100),
            getSplitForSecondaryBrehon(0),
            {from: defaults.secondaryBrehon_addr}
        );
      })
      .then(function raise2ndAppeal() {
        return brehonContract.raiseAppeal(
            {from: defaults.primaryBrehon_addr}
        );
      })
      .catch(assertError("Exception was not thrown when tertiaryBrehon tried to raise an appeal"));
  });

  it('or like a rando', () => {
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
            {from: defaults.accounts[6]}
        );
      })
      .then(function adjudicate() {
        return brehonContract.adjudicate(
            getSplitForSecondaryBrehon(100),
            getSplitForSecondaryBrehon(0),
            {from: defaults.secondaryBrehon_addr}
        );
      })
      .then(function raise2ndAppeal() {
        return brehonContract.raiseAppeal(
            {from: defaults.primaryBrehon_addr}
        );
      })
      .catch(assertError("Exception was not thrown when a rando tried to raise an appeal"));
  });
});

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
      .then(function raise2ndAppeal() {
        return brehonContract.raise2ndAppeal(
            {from: defaults.partyA_addr}
        );
      })
      .then(verifyEvent('AppealRaised', {
        '_appealLevel': 2,
        '_activeBrehon': defaults.tertiaryBrehon_addr
      }))
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
            assert.equal(activeBrehon[BrehonStruct.addr], defaults.tertiaryBrehon_addr, 'activeBrehon\'s address not set to tertiaryBrehon correctly');
            assert.equal(activeBrehon[BrehonStruct.fixedFee], defaults.tertiaryBrehon_fixedFee, 'activeBrehon\'s fixedFee not set to tertiaryBrehon\'s fixedFee');
            assert.equal(activeBrehon[BrehonStruct.disputeFee], defaults.tertiaryBrehon_disputeFee, 'activeBrehon\'s disputeFee not set to tertiaryBrehon\'s disputeFee');
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
      .then(function raise2ndAppeal() {
        return brehonContract.raise2ndAppeal(
            {from: defaults.partyB_addr}
        );
      })
      .then(verifyEvent('AppealRaised', {
        '_appealLevel': 2,
        '_activeBrehon': defaults.tertiaryBrehon_addr
      }))
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
            assert.equal(activeBrehon[BrehonStruct.addr], defaults.tertiaryBrehon_addr, 'activeBrehon\'s address not set to tertiaryBrehon correctly');
            assert.equal(activeBrehon[BrehonStruct.fixedFee], defaults.tertiaryBrehon_fixedFee, 'activeBrehon\'s fixedFee not set to tertiaryBrehon\'s fixedFee');
            assert.equal(activeBrehon[BrehonStruct.disputeFee], defaults.tertiaryBrehon_disputeFee, 'activeBrehon\'s disputeFee not set to tertiaryBrehon\'s disputeFee');
        });
      })
      .catch(function handleException(err) {
        console.log(err);
        assert.isNull(err, "Exception was thrown when partyA tried to raise an appeal");
      });
  });
});
