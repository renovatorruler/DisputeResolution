var BrehonContract = artifacts.require("./BrehonContract.sol");
var defaults = require('../config/deployment_settings.js').defaults;

var contractHelpers = require('../lib/contractHelpers.js');
var startContract = contractHelpers.startContract;
var getMinimumContractAmt = contractHelpers.getMinimumContractAmt;

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

contract('BrehonContract acceptContract method should allow partyA to accept the contract', function (accounts) {
  it('by only setting partyA\'s contractAccepted to true', function () {
    var brehonContract;
    return BrehonContract.deployed().then(function (instance) {
      brehonContract = instance;
      return brehonContract.acceptContract(defaults.partyA_addr);
    }).then(function () {
      return brehonContract.partyB.call().then(function (partyB) {
        assert.equal(partyB[PartyStruct.contractAccepted], false,
          "partyB's contractAccepted is incorrectly set to true");
      });
    }).then(function () {
      return brehonContract.primaryBrehon.call().then(function (primaryBrehon) {
        assert.equal(primaryBrehon[BrehonStruct.contractAccepted], false,
          "primaryBrehon's contractAccepted is incorrectly set to true");
      });
    }).then(function () {
      return brehonContract.secondaryBrehon.call().then(function (secondaryBrehon) {
        assert.equal(secondaryBrehon[BrehonStruct.contractAccepted], false,
          "secondaryBrehon's contractAccepted is incorrectly set to true");
      });
    }).then(function () {
      return brehonContract.tertiaryBrehon.call().then(function (tertiaryBrehon) {
        assert.equal(tertiaryBrehon[BrehonStruct.contractAccepted], false,
          "tertiaryBrehon's contractAccepted is incorrectly set to true");
      });
    }).then(function () {
      return brehonContract.partyA.call().then(function (partyA) {
        assert.equal(partyA[PartyStruct.contractAccepted], true,
          "partyA's contractAccepted is incorrectly set to false");
      });
    });
  });
});

contract('BrehonContract acceptContract method should allow partyB to accept the contract', function (accounts) {
  it('by only setting partyB\'s contractAccepted to true', function () {
    var brehonContract;
    return BrehonContract.deployed().then(function (instance) {
      brehonContract = instance;
      return brehonContract.acceptContract({from: defaults.partyB_addr});
    }).then(function () {
      return brehonContract.partyA.call().then(function (partyA) {
        assert.equal(partyA[PartyStruct.contractAccepted], false,
          "partyA's contractAccepted is incorrectly set to true");
      });
    }).then(function () {
      return brehonContract.partyB.call().then(function (partyB) {
        assert.equal(partyB[PartyStruct.contractAccepted], true,
          "partyB's contractAccepted is incorrectly set to false");
      });
    }).then(function () {
      return brehonContract.primaryBrehon.call().then(function (primaryBrehon) {
        assert.equal(primaryBrehon[BrehonStruct.contractAccepted], false,
          "primaryBrehon's contractAccepted is incorrectly set to true");
      });
    }).then(function () {
      return brehonContract.secondaryBrehon.call().then(function (secondaryBrehon) {
        assert.equal(secondaryBrehon[BrehonStruct.contractAccepted], false,
          "secondaryBrehon's contractAccepted is incorrectly set to true");
      });
    }).then(function () {
      return brehonContract.tertiaryBrehon.call().then(function (tertiaryBrehon) {
        assert.equal(tertiaryBrehon[BrehonStruct.contractAccepted], false,
          "tertiaryBrehon's contractAccepted is incorrectly set to true");
      });
    });
  });
});

contract('BrehonContract acceptContract method should allow primaryBrehon to accept the contract', function (accounts) {
  it('by only setting primaryBrehon\'s contractAccepted to true', function () {
    var brehonContract;
    return BrehonContract.deployed().then(function (instance) {
      brehonContract = instance;
      return brehonContract.acceptContract({from: defaults.primaryBrehon_addr});
    }).then(function () {
      return brehonContract.partyA.call().then(function (partyA) {
        assert.equal(partyA[PartyStruct.contractAccepted], false,
          "partyA's contractAccepted is incorrectly set to true");
      });
    }).then(function () {
      return brehonContract.partyB.call().then(function (partyB) {
        assert.equal(partyB[PartyStruct.contractAccepted], false,
          "partyB's contractAccepted is incorrectly set to true");
      });
    }).then(function () {
      return brehonContract.primaryBrehon.call().then(function (primaryBrehon) {
        assert.equal(primaryBrehon[BrehonStruct.contractAccepted], true,
          "primaryBrehon's contractAccepted is incorrectly set to false");
      });
    }).then(function () {
      return brehonContract.secondaryBrehon.call().then(function (secondaryBrehon) {
        assert.equal(secondaryBrehon[BrehonStruct.contractAccepted], false,
          "secondaryBrehon's contractAccepted is incorrectly set to true");
      });
    }).then(function () {
      return brehonContract.tertiaryBrehon.call().then(function (tertiaryBrehon) {
        assert.equal(tertiaryBrehon[BrehonStruct.contractAccepted], false,
          "tertiaryBrehon's contractAccepted is incorrectly set to true");
      });
    });
  });
});

contract('BrehonContract acceptContract method should allow secondaryBrehon to accept the contract', function (accounts) {
  it('by only setting secondaryBrehon\'s contractAccepted to true', function () {
    var brehonContract;
    return BrehonContract.deployed().then(function (instance) {
      brehonContract = instance;
      return brehonContract.acceptContract({from: defaults.secondaryBrehon_addr});
    }).then(function () {
      return brehonContract.partyA.call().then(function (partyA) {
        assert.equal(partyA[PartyStruct.contractAccepted], false,
          "partyA's contractAccepted is incorrectly set to true");
      });
    }).then(function () {
      return brehonContract.partyB.call().then(function (partyB) {
        assert.equal(partyB[PartyStruct.contractAccepted], false,
          "partyB's contractAccepted is incorrectly set to true");
      });
    }).then(function () {
      return brehonContract.primaryBrehon.call().then(function (primaryBrehon) {
        assert.equal(primaryBrehon[BrehonStruct.contractAccepted], false,
          "primaryBrehon's contractAccepted is incorrectly set to true");
      });
    }).then(function () {
      return brehonContract.secondaryBrehon.call().then(function (secondaryBrehon) {
        assert.equal(secondaryBrehon[BrehonStruct.contractAccepted], true,
          "secondaryBrehon's contractAccepted is incorrectly set to false");
      });
    }).then(function () {
      return brehonContract.tertiaryBrehon.call().then(function (tertiaryBrehon) {
        assert.equal(tertiaryBrehon[BrehonStruct.contractAccepted], false,
          "tertiaryBrehon's contractAccepted is incorrectly set to true");
      });
    });
  });
});

contract('BrehonContract acceptContract method should allow tertiaryBrehon to accept the contract', function (accounts) {
  it('by only setting tertiaryBrehon\'s contractAccepted to true', function () {
    var brehonContract;
    return BrehonContract.deployed().then(function (instance) {
      brehonContract = instance;
      return brehonContract.acceptContract({from: defaults.tertiaryBrehon_addr});
    }).then(function () {
      return brehonContract.partyA.call().then(function (partyA) {
        assert.equal(partyA[PartyStruct.contractAccepted], false,
          "partyA's contractAccepted is incorrectly set to true");
      });
    }).then(function () {
      return brehonContract.partyB.call().then(function (partyB) {
        assert.equal(partyB[PartyStruct.contractAccepted], false,
          "partyB's contractAccepted is incorrectly set to true");
      });
    }).then(function () {
      return brehonContract.primaryBrehon.call().then(function (primaryBrehon) {
        assert.equal(primaryBrehon[BrehonStruct.contractAccepted], false,
          "primaryBrehon's contractAccepted is incorrectly set to true");
      });
    }).then(function () {
      return brehonContract.secondaryBrehon.call().then(function (secondaryBrehon) {
        assert.equal(secondaryBrehon[BrehonStruct.contractAccepted], false,
          "secondaryBrehon's contractAccepted is incorrectly set to true");
      });
    }).then(function () {
      return brehonContract.tertiaryBrehon.call().then(function (tertiaryBrehon) {
        assert.equal(tertiaryBrehon[BrehonStruct.contractAccepted], true,
          "tertiaryBrehon's contractAccepted is incorrectly set to false");
      });
    });
  });
});

contract('BrehonContract acceptContract method should not allow someone else to accept the contract', function (accounts) {
  it('by throwing an exception', function () {
    var brehonContract;
    return BrehonContract.deployed().then(function (instance) {
      brehonContract = instance;
      return brehonContract.acceptContract({from: accounts[6]});
    }).then(function () {
      return brehonContract.partyA.call().then(function (partyA) {
        assert.equal(partyA[PartyStruct.contractAccepted], false,
          "partyA's contractAccepted is incorrectly set to true");
      });
    }).then(function () {
      return brehonContract.partyB.call().then(function (partyB) {
        assert.equal(partyB[PartyStruct.contractAccepted], false,
          "partyB's contractAccepted is incorrectly set to true");
      });
    }).then(function () {
      return brehonContract.primaryBrehon.call().then(function (primaryBrehon) {
        assert.equal(primaryBrehon[BrehonStruct.contractAccepted], false,
          "primaryBrehon's contractAccepted is incorrectly set to true");
      });
    }).then(function () {
      return brehonContract.secondaryBrehon.call().then(function (secondaryBrehon) {
        assert.equal(secondaryBrehon[BrehonStruct.contractAccepted], false,
          "secondaryBrehon's contractAccepted is incorrectly set to true");
      });
    }).then(function () {
      return brehonContract.tertiaryBrehon.call().then(function (tertiaryBrehon) {
        assert.equal(tertiaryBrehon[BrehonStruct.contractAccepted], false,
          "tertiaryBrehon's contractAccepted is incorrectly set to true");
      });
    }).catch(function (err) {
      assert.isNotNull(err, "Exception was not thrown when an unregistered party tried to accept the contract");
    });
  });
});

contract('BrehonContract acceptContract should ', function (accounts) {
  it('only be executed at Negotiation stage', function () {
    var brehonContract;
    return BrehonContract.deployed()
      .then(function captureReference(instance) {
        brehonContract = instance;
        return instance;
      })
      .then(startContract([{
        addr: defaults.partyB_addr,
        value: getMinimumContractAmt(defaults)
      }])(defaults.partyB_addr))
      .then(function () {
        return brehonContract.acceptContract({from: defaults.partyA_addr});
      })
    .catch(function (err) {
      assert.isNotNull(err, "Exception was not thrown when acceptContract was triggerred at a stage which was not Negotiation stage");
    });
  });
});
