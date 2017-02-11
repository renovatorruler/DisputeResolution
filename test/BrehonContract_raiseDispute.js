const BrehonContract = artifacts.require("./BrehonContract.sol");
const defaults = require('../config/deployment_settings.js').defaults;

const contractHelpers = require('../lib/contractHelpers.js');
const startContract = contractHelpers.startContract;
const getMinimumContractAmt = contractHelpers.getMinimumContractAmt;
const PartyStruct = contractHelpers.PartyStruct;
const BrehonStruct = contractHelpers.BrehonStruct;

contract('BrehonContract should allow partyA to raise the dispute', (accounts) => {
  it('when partyA deposited the funds', () => {
    var brehonContract;
    return BrehonContract.deployed()
      .then(function captureReference(instance) {
        brehonContract = instance;
        return instance;
      })
      .then(startContract([{
        addr: defaults.partyA_addr,
        value:getMinimumContractAmt(defaults)}])(defaults.partyA_addr))
      .then(() => {
        return brehonContract.raiseDispute({
            from: defaults.partyA_addr
        })
      })
      .then(() => {
        return brehonContract.stage.call().then((stage) => {
            assert.equal(stage.valueOf(), 2, "stage is not set to Stages.Dispute");
        });
      })
      .catch((err) => {
        assert.isNull(err, "Exception was thrown when partyA tried to raise a dispute");
      });
  });
});

contract('BrehonContract should allow partyB to raise the dispute', (accounts) => {
  it('when partyB deposited the funds', () => {
    var brehonContract;
    return BrehonContract.deployed()
      .then(function captureReference(instance) {
        brehonContract = instance;
        return instance;
      })
      .then(startContract([{
        addr: defaults.partyB_addr,
        value:getMinimumContractAmt(defaults)}])(defaults.partyB_addr))
      .then(() => {
        return brehonContract.raiseDispute({
            from: defaults.partyB_addr
        })
      })
      .then(() => {
        return brehonContract.stage.call().then((stage) => {
            assert.equal(stage.valueOf(), 2, "stage is not set to Stages.Dispute");
        });
      })
      .catch((err) => {
        assert.isNull(err, "Exception was thrown when partyB tried to raise a dispute");
      });
  });
});

contract('BrehonContract should allow partyA to raise the dispute', (accounts) => {
  it('when partyB deposited the funds', () => {
    var brehonContract;
    return BrehonContract.deployed()
      .then(function captureReference(instance) {
        brehonContract = instance;
        return instance;
      })
      .then(startContract([{
        addr: defaults.partyB_addr,
        value: getMinimumContractAmt(defaults)}])(defaults.partyB_addr))
      .then(() => {
        return brehonContract.raiseDispute({
            from: defaults.partyA_addr
        })
      })
      .then(() => {
        return brehonContract.stage.call().then((stage) => {
            assert.equal(stage.valueOf(), 2, "stage is not set to Stages.Dispute");
        });
      })
      .catch((err) => {
        assert.isNull(err, "Exception was thrown when partyA tried to raise a dispute");
      });
  });
});

contract('BrehonContract should allow partyB to raise the dispute', (accounts) => {
  it('when partyA deposited the funds', () => {
    var brehonContract;
    return BrehonContract.deployed()
      .then(function captureReference(instance) {
        brehonContract = instance;
        return instance;
      })
      .then(startContract([{
        addr: defaults.partyA_addr,
        value: getMinimumContractAmt(defaults)}])(defaults.partyA_addr))
      .then(() => {
        return brehonContract.raiseDispute({
            from: defaults.partyB_addr
        })
      })
      .then(() => {
        return brehonContract.stage.call().then((stage) => {
            assert.equal(stage.valueOf(), 2, "stage is not set to Stages.Dispute");
        });
      })
      .catch((err) => {
        assert.isNull(err, "Exception was thrown when partyB tried to raise a dispute");
      });
  });
});
