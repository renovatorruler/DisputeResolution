const R = require('ramda');

const BrehonContract = artifacts.require("./BrehonContract.sol");
const defaults = require('../config/deployment_settings.js').defaults;

const contractHelpers = require('../lib/contractHelpers.js');
const startContract = contractHelpers.startContract;
const startContractAndRaiseDispute = contractHelpers.startContractAndRaiseDispute;
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
      .then(startContractAndRaiseDispute(
        [{
          addr: defaults.partyA_addr,
          value: getMinimumContractAmt(defaults)
        }], defaults.partyA_addr, defaults.partyA_addr))
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
      .then(startContractAndRaiseDispute(
        [{
          addr: defaults.partyB_addr,
          value: getMinimumContractAmt(defaults)
        }], defaults.partyB_addr, defaults.partyB_addr))
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
      .then(startContractAndRaiseDispute(
        [{
          addr: defaults.partyB_addr,
          value: getMinimumContractAmt(defaults)
        }], defaults.partyA_addr, defaults.partyA_addr))
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
      .then(startContractAndRaiseDispute(
        [{
          addr: defaults.partyA_addr,
          value: getMinimumContractAmt(defaults)
        }], defaults.partyA_addr, defaults.partyB_addr))
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

contract('BrehonContract raiseDispute should only be raised at Execution stage', (accounts) => {
  it('by preventing it from being raised at Negotiaton stage', () => {
    var brehonContract;
    return BrehonContract.deployed()
      .then(function captureReference(instance) {
        brehonContract = instance;
        return instance;
      })
      .then(() => {
        return brehonContract.raiseDispute({from: defaults.partyA_addr});
      })
      .catch((err) => {
        assert.isNotNull(err, "Exception was not thrown when raiseDispute was triggerred at the Negotiation stage");
      });
  });

  it('by preventing it from being raised at Dispute stage', () => {
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
      .then(() => {
        return brehonContract.raiseDispute({from: defaults.partyA_addr});
      })
      .catch((err) => {
        assert.isNotNull(err, "Exception was not thrown when raiseDispute was triggerred at the Negotiation stage");
      });
  });
});

contract('BrehonContract raiseDispute should not be raised by unauthorized addresses', (accounts) => {
  it('by preventing primaryBrehon from raising a dispute', () => {
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
        }], defaults.partyA_addr, defaults.primaryBrehon_addr))
      .catch((err) => {
        assert.isNotNull(err, "Exception was not thrown when primaryBrehon tried to raise a dispute");
      });
  });

  it('by preventing secondaryBrehon from raising a dispute', () => {
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
        }], defaults.partyA_addr, defaults.secondaryBrehon_addr))
      .catch((err) => {
        assert.isNotNull(err, "Exception was not thrown when secondaryBrehon tried to raise a dispute");
      });
  });

  it('by preventing tertiaryBrehon from raising a dispute', () => {
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
        }], defaults.partyA_addr, defaults.tertiaryBrehon_addr))
      .catch((err) => {
        assert.isNotNull(err, "Exception was not thrown when tertiaryBrehon tried to raise a dispute");
      });
  });

  it('by preventing a rando from raising a dispute', () => {
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
        }], defaults.partyA_addr, accounts[6]))
      .catch((err) => {
        assert.isNotNull(err, "Exception was not thrown when a rando tried to raise a dispute");
      });
  });
});

contract('BrehonContract should set appealLevel to 0 and trigger ContractDisputed event', (accounts) => {
  it('when dispute is first raised', () => {
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
      .then((result) => {
        var contractDisputedEvent = R.find(R.propEq('event', 'ContractDisputed'), result.logs);
        assert.equal(contractDisputedEvent.args._disputingParty, defaults.partyA_addr,
          "ContractDisputed event did not correctly provide the party disputed the contract");
        assert.equal(contractDisputedEvent.args._activeBrehon, defaults.primaryBrehon_addr,
          "ContractDisputed event did not correctly provide the deposits at the time of contract start");
        assert.isDefined(contractDisputedEvent, "ContractStarted event was not emitted");

        return brehonContract.appealLevel.call().then((appealLevel) => {
          assert.equal(appealLevel.valueOf(), 0, 'appealLevel is not set to 0 when dispute  is raised'); 
        });
      });
  });
});

contract('BrehonContract should set primaryBrehon as the activeBrehon', (accounts) => {
  it('when dispute is first raised', () => {
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
      .then(function verifyActiveBrehon() {
        return brehonContract.activeBrehon.call().then((activeBrehon) => {
            assert.equal(activeBrehon[BrehonStruct.contractAccepted], true, 'activeBrehon\'s contractAccepted should be set to true');
            assert.equal(activeBrehon[BrehonStruct.addr], defaults.primaryBrehon_addr, 'activeBrehon\'s address not set to primaryBrehon correctly');
            assert.equal(activeBrehon[BrehonStruct.fixedFee], defaults.primaryBrehon_fixedFee, 'activeBrehon\'s fixedFee not set to primaryBrehon\'s fixedFee');
            assert.equal(activeBrehon[BrehonStruct.disputeFee], defaults.primaryBrehon_disputeFee, 'activeBrehon\'s disputeFee not set to primaryBrehon\'s disputeFee');
        });
      });
  });
});
