var BrehonContract = artifacts.require("./BrehonContract.sol");
var defaults = require('../config/deployment_settings.js').defaults;

var PartyStruct = {
  addr: 0,
  deposit: 1,
  contractAccepted: 2,
  primaryBrehonApproval: 3,
  secondaryBrehonApproval: 4,
  tertiaryBrehonApproval: 5
};

var BrehonStruct = {
  addr: 0,
  contractAccepted: 1,
  fixedFee: 2,
  disputeFee: 3
};

contract('BrehonContract should accept funds from partyA', function (accounts) {
  it('by correctly setting partyA\'s deposit', function () {
    var brehonContract;
    return BrehonContract.deployed().then(function (instance) {
      brehonContract = instance;
      return brehonContract.deposit({from: defaults.partyA_addr, value: defaults.transactionAmount});
    }).then(function () {
      return brehonContract.partyA.call().then(function (partyA) {
        assert.equal(partyA[PartyStruct.deposit].valueOf(), defaults.transactionAmount,
          "partyA's contractAccepted is incorrectly set");
      });
    }).then(function () {
      return brehonContract.partyB.call().then(function (partyB) {
        assert.equal(partyB[PartyStruct.deposit].valueOf(), 0,
          "partyB's contractAccepted is incorrectly set");
      });
    });
  });
});

contract('BrehonContract should accept funds from partyB', function (accounts) {
  it('by correctly setting partyB\'s deposit', function () {
    var brehonContract;
    return BrehonContract.deployed().then(function (instance) {
      brehonContract = instance;
      return brehonContract.deposit({from: defaults.partyB_addr, value: defaults.transactionAmount});
    }).then(function () {
      return brehonContract.partyA.call().then(function (partyA) {
        assert.equal(partyA[PartyStruct.deposit].valueOf(), 0,
          "partyA's contractAccepted is incorrectly set");
      });
    }).then(function () {
      return brehonContract.partyB.call().then(function (partyB) {
        assert.equal(partyB[PartyStruct.deposit].valueOf(), defaults.transactionAmount,
          "partyB's contractAccepted is incorrectly set");
      });
    });
  });
});

contract('BrehonContract shouldnt\'t accept funds from unauthorized addresses', function (accounts) {
  it('like from the primaryBrehon', function () {
    var brehonContract;
    return BrehonContract.deployed().then(function (instance) {
      brehonContract = instance;
      return brehonContract.deposit({from: defaults.primaryBrehon_addr, value: defaults.transactionAmount});
    }).then(function () {
      return brehonContract.partyA.call().then(function (partyA) {
        assert.equal(partyA[PartyStruct.deposit].valueOf(), 0,
          "partyA's contractAccepted is incorrectly set");
      });
    }).then(function () {
      return brehonContract.partyB.call().then(function (partyB) {
        assert.equal(partyB[PartyStruct.deposit].valueOf(), 0,
          "partyB's contractAccepted is incorrectly set");
      });
    }).catch(function (err) {
      assert.isNotNull(err, "Exception was not thrown when a primaryBrehon tried to deposit funds to the contract");
    });
  });

  it('or from the secondaryBrehon', function () {
    var brehonContract;
    return BrehonContract.deployed().then(function (instance) {
      brehonContract = instance;
      return brehonContract.deposit({from: defaults.secondaryBrehon_addr, value: defaults.transactionAmount});
    }).then(function () {
      return brehonContract.partyA.call().then(function (partyA) {
        assert.equal(partyA[PartyStruct.deposit].valueOf(), 0,
          "partyA's contractAccepted is incorrectly set");
      });
    }).then(function () {
      return brehonContract.partyB.call().then(function (partyB) {
        assert.equal(partyB[PartyStruct.deposit].valueOf(), 0,
          "partyB's contractAccepted is incorrectly set");
      });
    }).catch(function (err) {
      assert.isNotNull(err, "Exception was not thrown when a secondaryBrehon tried to deposit funds to the contract");
    });
  });

  it('or from the tertiaryBrehon', function () {
    var brehonContract;
    return BrehonContract.deployed().then(function (instance) {
      brehonContract = instance;
      return brehonContract.deposit({from: defaults.tertiaryBrehon_addr, value: defaults.transactionAmount});
    }).then(function () {
      return brehonContract.partyA.call().then(function (partyA) {
        assert.equal(partyA[PartyStruct.deposit].valueOf(), 0,
          "partyA's contractAccepted is incorrectly set");
      });
    }).then(function () {
      return brehonContract.partyB.call().then(function (partyB) {
        assert.equal(partyB[PartyStruct.deposit].valueOf(), 0,
          "partyB's contractAccepted is incorrectly set");
      });
    }).catch(function (err) {
      assert.isNotNull(err, "Exception was not thrown when a tertiaryBrehon tried to deposit funds to the contract");
    });
  });

  it('or from a rando', function () {
    var brehonContract;
    return BrehonContract.deployed().then(function (instance) {
      brehonContract = instance;
      return brehonContract.deposit({from: accounts[6], value: defaults.transactionAmount});
    }).then(function () {
      return brehonContract.partyA.call().then(function (partyA) {
        assert.equal(partyA[PartyStruct.deposit].valueOf(), 0,
          "partyA's contractAccepted is incorrectly set");
      });
    }).then(function () {
      return brehonContract.partyB.call().then(function (partyB) {
        assert.equal(partyB[PartyStruct.deposit].valueOf(), 0,
          "partyB's contractAccepted is incorrectly set");
      });
    }).catch(function (err) {
      assert.isNotNull(err, "Exception was not thrown when a rando tried to deposit funds to the contract");
    });
  });
});
