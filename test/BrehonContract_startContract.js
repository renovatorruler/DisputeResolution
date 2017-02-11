var BrehonContract = artifacts.require("./BrehonContract.sol");
var defaults = require('../config/deployment_settings.js').defaults;
var BigNumber = require('bignumber.js');
var R = require('ramda');

function getMinimumContractAmt(contract_settings) {
    return new BigNumber(contract_settings.transactionAmount)
      .add(new BigNumber(contract_settings.primaryBrehon_fixedFee))
      .add(new BigNumber(contract_settings.primaryBrehon_disputeFee))
      .add(new BigNumber(contract_settings.secondaryBrehon_fixedFee))
      .add(new BigNumber(contract_settings.secondaryBrehon_disputeFee))
      .add(new BigNumber(contract_settings.tertiaryBrehon_fixedFee))
      .add(new BigNumber(contract_settings.tertiaryBrehon_disputeFee)).valueOf();
}

var startContract = R.curry(function startContract(party_contributions, starting_party_addr, brehonContract) {
  return Promise.all(R.map(function(party_tuple) {
    return brehonContract.deposit({
      from: party_tuple.addr,
      value: R.defaultTo(getMinimumContractAmt(defaults), party_tuple.value)
    });
  }, party_contributions))
    .then(function () {
      return brehonContract.startContract({
        from: R.defaultTo(R.head(party_contributions), starting_party_addr)
      });
    });
});

contract('BrehonContract should allow partyA to self fund and start the contract', function (accounts) {
  it('by only letting partyA fund the contract and triggerring startContract', function () {
    var brehonContract;
    return BrehonContract.deployed()
      .then(function captureReference(instance) {
        brehonContract = instance;
        return instance;
      })
      .then(startContract([{
        addr: defaults.partyA_addr,
        value:getMinimumContractAmt(defaults)}])(defaults.partyA_addr))
      .then(function (result) {
        var executionStartedEvent = R.find(R.propEq('event', 'ExecutionStarted'), result.logs);
        assert.equal(executionStartedEvent.args._caller, defaults.partyA_addr,
          "ExecutionStarted event did not correctly provide the party which called the contract");
        assert.equal(executionStartedEvent.args._totalDeposits, getMinimumContractAmt(defaults),
          "ExecutionStarted event did not correctly provide the deposits at the time of contract start");
        assert.isDefined(executionStartedEvent, "ExecutionStarted event was not emitted");

        return brehonContract.stage.call().then(function (stage) {
          assert.equal(stage.valueOf(), 1, "stage is not set to Stages.Execution");
        });
      }).catch(function (err) {
        assert.isNull(err, "Exception was thrown when partyA tried to start the contract");
      });
  });
});

contract('BrehonContract should allow partyB to self fund and start the contract', function (accounts) {
  it('by only letting partyB fund the contract and triggerring startContract', function () {
    var brehonContract;
    return BrehonContract.deployed()
      .then(function captureReference(instance) {
        brehonContract = instance;
        return instance;
      })
      .then(startContract([{
        addr: defaults.partyB_addr,
        value:getMinimumContractAmt(defaults)
      }])(defaults.partyB_addr))
      .then(function (result) {
        var executionStartedEvent = R.find(R.propEq('event', 'ExecutionStarted'), result.logs);
        assert.equal(executionStartedEvent.args._caller, defaults.partyB_addr,
          "ExecutionStarted event did not correctly provide the party which called the contract");
        assert.equal(executionStartedEvent.args._totalDeposits, getMinimumContractAmt(defaults),
          "ExecutionStarted event did not correctly provide the deposits at the time of contract start");
        assert.isDefined(executionStartedEvent, "ExecutionStarted event was not emitted");

        return brehonContract.stage.call().then(function (stage) {
          assert.equal(stage.valueOf(), 1, "stage is not set to Stages.Execution");
        });
      }).catch(function (err) {
        assert.isNull(err, "Exception was thrown when partyB tried to start the contract");
      });
  });
});

contract('BrehonContract should allow partyA to start the contract', function (accounts) {
  it('by letting both parties fund the contract and partyA call startContract', function () {
    var brehonContract;
    return BrehonContract.deployed()
      .then(function captureReference(instance) {
        brehonContract = instance;
        return instance;
      })
      .then(startContract([
        {
          addr: defaults.partyA_addr,
          value: defaults.secondaryBrehon_disputeFee
        }, {
          addr: defaults.partyB_addr,
          value: new BigNumber(getMinimumContractAmt(defaults))
            .minus(new BigNumber(defaults.secondaryBrehon_disputeFee)).valueOf()
        }
      ])(defaults.partyA_addr))
      .then(function (result) {
        var executionStartedEvent = R.find(R.propEq('event', 'ExecutionStarted'), result.logs);
        assert.equal(executionStartedEvent.args._caller, defaults.partyA_addr,
          "ExecutionStarted event did not correctly provide the party which called the contract");
        assert.equal(executionStartedEvent.args._totalDeposits, getMinimumContractAmt(defaults),
          "ExecutionStarted event did not correctly provide the deposits at the time of contract start");
        assert.isDefined(executionStartedEvent, "ExecutionStarted event was not emitted");

        return brehonContract.stage.call().then(function (stage) {
          assert.equal(stage.valueOf(), 1, "stage is not set to Stages.Execution");
        });
      }).catch(function (err) {
        assert.isNull(err, "Exception was thrown when partyA tried to start the contract");
      });
  });
});

contract('BrehonContract should allow partyB to start the contract', function (accounts) {
  it('by letting both parties fund the contract and partyB call startContract', function () {
    var brehonContract;
    return BrehonContract.deployed()
      .then(function captureReference(instance) {
        brehonContract = instance;
        return instance;
      })
      .then(startContract([
        {
          addr: defaults.partyA_addr,
          value: new BigNumber(getMinimumContractAmt(defaults))
            .minus(new BigNumber(defaults.secondaryBrehon_disputeFee)).valueOf()
        }, {
          addr: defaults.partyB_addr,
          value: defaults.secondaryBrehon_disputeFee
        }
      ])(defaults.partyB_addr))
      .then(function (result) {
        var executionStartedEvent = R.find(R.propEq('event', 'ExecutionStarted'), result.logs);
        assert.equal(executionStartedEvent.args._caller, defaults.partyB_addr,
          "ExecutionStarted event did not correctly provide the party which called the contract");
        assert.equal(executionStartedEvent.args._totalDeposits, getMinimumContractAmt(defaults),
          "ExecutionStarted event did not correctly provide the deposits at the time of contract start");
        assert.isDefined(executionStartedEvent, "ExecutionStarted event was not emitted");

        return brehonContract.stage.call().then(function (stage) {
          assert.equal(stage.valueOf(), 1, "stage is not set to Stages.Execution");
        });
      }).catch(function (err) {
        assert.isNull(err, "Exception was thrown when partyB tried to start the contract");
      });
  });
});

contract('BrehonContract should not allow contract to be started with insufficient funds', function (accounts) {
  it('by partyA', function () {
    var brehonContract;
    return BrehonContract.deployed().then(function (instance) {
      brehonContract = instance;
      return brehonContract.deposit({from: defaults.partyB_addr, value: 100});
    }).then(function () {
      return brehonContract.startContract({from: defaults.partyA_addr});
    }).catch(function (err) {
      assert.isNotNull(err, "Exception was thrown when partyA tried to start the contract");
    });
  });

  it('by partyB', function () {
    var brehonContract;
    return BrehonContract.deployed().then(function (instance) {
      brehonContract = instance;
      return brehonContract.deposit({from: defaults.partyA_addr, value: 100});
    }).then(function () {
      return brehonContract.startContract({from: defaults.partyB_addr});
    }).catch(function (err) {
      assert.isNotNull(err, "Exception was thrown when partyB tried to start the contract");
    });
  });
});

contract("BrehonContract startContract shouldn't allow anyone else", function (accounts) {
  it('to start the contract', function () {
    var brehonContract;
    return BrehonContract.deployed()
      .then(function captureReference(instance) {
        brehonContract = instance;
        return instance;
      })
      .then(startContract([{
        addr: defaults.partyB_addr,
        value:getMinimumContractAmt(defaults)
      }])(accounts[6]))
    .catch(function (err) {
      assert.isNotNull(err, "Exception was not thrown when a rando tried to start the contract");
      return brehonContract.stage.call().then(function (stage) {
        assert.equal(stage.valueOf(), 0, "stage is not set to Stages.Negotiation");
      });
    });
  });
});

contract('BrehonContract startContract should ', function (accounts) {
  it('only be executed at Negotiation stage', function () {
    var brehonContract;
    return BrehonContract.deployed()
      .then(function captureReference(instance) {
        brehonContract = instance;
        return instance;
      })
      .then(startContract([{
        addr: defaults.partyB_addr,
        value:getMinimumContractAmt(defaults)
      }])(defaults.partyB_addr))
      .then(function () {
        return brehonContract.startContract({from: defaults.partyA_addr});
      })
    .catch(function (err) {
      assert.isNotNull(err, "Exception was not thrown when startContract was triggerred at a stage which was not Negotiation stage");
    });
  });
});
