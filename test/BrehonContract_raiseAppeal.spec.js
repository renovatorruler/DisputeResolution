const BrehonContract = artifacts.require('./BrehonContract.sol');
const defaults = require('../config/deployment_settings.js').defaults;

const contractHelpers = require('../lib/contractHelpers.js');

const startContract = contractHelpers.startContract;
const startContractAndRaiseDispute = contractHelpers.startContractAndRaiseDispute;
const verifyEvent = contractHelpers.verifyEvent;
const getMinimumContractAmt = contractHelpers.getMinimumContractAmt;
const getSplitForPrimaryBrehon = contractHelpers.getPercentageSplit(defaults, 0);
const assertNoError = contractHelpers.assertNoError;
const BrehonStruct = contractHelpers.BrehonStruct;
const StagesStruct = contractHelpers.StagesStruct;

contract('BrehonContract raiseAppeal should only be allowed at Dispute stage', () => {
  it('by preventing it from being called at Negotiation stage', () => {
    let brehonContract;
    return BrehonContract.deployed()
      .then(function captureReference(instance) {
        brehonContract = instance;
        return instance;
      })
      .then(function raiseAppeal() {
        return brehonContract.raiseAppeal({ from: defaults.partyA });
      })
      .catch((err) => {
        assert.isNotNull(err, 'Exception was not thrown when raiseAppeal() was triggerred at the Negotiation stage');
      });
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
      .then(function raiseAppeal() {
        return brehonContract.raiseAppeal({ from: defaults.partyA_addr });
      })
      .catch((err) => {
        assert.isNotNull(err, 'Exception was not thrown when raiseAppeal() was triggerred at the Execution stage');
      });
  });

  it('by preventing it from being called at AppealPeriod stage', () => {
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
      .then(function raiseAppeal() {
        return brehonContract.raiseAppeal({ from: defaults.partyA_addr });
      })
      .catch((err) => {
        assert.isNotNull(err, 'Exception was not thrown when raiseAppeal() was triggerred at the AppealPeriod stage');
      });
  });
});

contract('BrehonContract should not allow an unauthorized party to raise an appeal', () => {
  it('like the primaryBrehon', () => {
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
      .then(function raiseAppeal() {
        return brehonContract.raiseAppeal({ from: defaults.primaryBrehon_addr });
      })
      .catch(function handleException(err) {
        assert.isNotNull(err, 'Exception was not thrown when primaryBrehon tried to raise an appeal');
      });
  });

  it('like the secondaryBrehon', () => {
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
      .then(function raiseAppeal() {
        return brehonContract.raiseAppeal({ from: defaults.secondaryBrehon_addr });
      })
      .catch(function handleException(err) {
        assert.isNotNull(err, 'Exception was not thrown when secondaryBrehon tried to raise an appeal');
      });
  });

  it('like the tertiaryBrehon', () => {
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
      .then(function raiseAppeal() {
        return brehonContract.raiseAppeal({ from: defaults.tertiaryBrehon_addr });
      })
      .catch(function handleException(err) {
        assert.isNotNull(err, 'Exception was not thrown when tertiaryBrehon tried to raise an appeal');
      });
  });

  it('or like a rando', () => {
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
      .then(function raiseAppeal() {
        return brehonContract.raiseAppeal({ from: defaults.accounts[6] });
      })
      .catch(function handleException(err) {
        assert.isNotNull(err, 'Exception was not thrown when a rando tried to raise an appeal');
      });
  });
});

contract('BrehonContract should allow partyA to raise an appeal', () => {
  it('when he is dissatisfied by the resolution provided by the primaryBrehon', () => {
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
      .catch(assertNoError('No Exception must be thrown after adjudication'))
      .then(function raiseAppeal() {
        return brehonContract.raiseAppeal({ from: defaults.partyA_addr });
      })
      .catch(assertNoError('No Exception must be thrown after raiseAppeal'))
      .then(verifyEvent('AppealRaised', {
        appealingParty: defaults.partyA_addr,
        activeBrehon: defaults.secondaryBrehon_addr,
      }))
      .then(function verifyStage() {
        return brehonContract.stage.call().then((stage) => {
          assert.equal(stage.valueOf(), StagesStruct.Appeal, 'stage is not set to Stages.Appeal');
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
        console.error(err);
        assert.isNull(err, 'Exception was thrown when partyA tried to raise an appeal');
      });
  });
});

contract('BrehonContract should allow partyB to raise an appeal', () => {
  it('when he is dissatisfied by the resolution provided by the primaryBrehon', () => {
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
            getSplitForPrimaryBrehon(0),
            getSplitForPrimaryBrehon(100),
            { from: defaults.primaryBrehon_addr });
      })
      .then(function raiseAppeal() {
        return brehonContract.raiseAppeal({ from: defaults.partyB_addr });
      })
      .then(verifyEvent('AppealRaised', {
        appealingParty: defaults.partyB_addr,
        activeBrehon: defaults.secondaryBrehon_addr,
      }))
      .then(function verifyStage() {
        return brehonContract.stage.call().then((stage) => {
          assert.equal(stage.valueOf(), StagesStruct.Appeal, 'stage is not set to Stages.Appeal');
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
        console.error(err);
        assert.isNull(err, 'Exception was thrown when partyB tried to raise an appeal');
      });
  });
});
