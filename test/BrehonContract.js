var BrehonContract = artifacts.require("./BrehonContract.sol");
var defaults = require('../config/deployment_settings.js').defaults;
var BigNumber = require('bignumber.js');
var R = require('ramda');

function getMinimumContractAmt(contract_settings) {
    return new BigNumber(contract_settings.transactionAmount)
      .add(new BigNumber(contract_settings.primaryBrehon_fixedFee))
      .add(new BigNumber(contract_settings.primaryBrehon_fixedFee))
      .add(new BigNumber(contract_settings.secondaryBrehon_disputeFee))
      .add(new BigNumber(contract_settings.secondaryBrehon_disputeFee))
      .add(new BigNumber(contract_settings.tertiaryBrehon_fixedFee))
      .add(new BigNumber(contract_settings.tertiaryBrehon_disputeFee)).valueOf();
}

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

contract('BrehonContract constructor', function (accounts) {
  it('should set appealLevel to -1', function () {
    return BrehonContract.deployed().then(function (instance) {
      return instance.appealLevel.call().then(function (appealLevel) {
        assert.equal(appealLevel.valueOf(), -1);
      });
    });
  });

  it('should set transactionAmount to ' + defaults.transactionAmount, function () {
    return BrehonContract.deployed().then(function (instance) {
      return instance.transactionAmount.call().then(function (transactionAmount) {
        assert.equal(transactionAmount.valueOf(), defaults.transactionAmount);
      });
    });
  });

  it('should set the stage to Negotiation', function () {
    return BrehonContract.deployed().then(function (instance) {
      return instance.stage.call().then(function (stage) {
        assert.equal(stage.valueOf(), 0);
      });
    });
  });

  it("should set partyA's address properly", function () {
    return BrehonContract.deployed().then(function (brehonContract) {
      return brehonContract.partyA.call().then(function (partyA) {
        assert.equal(partyA[PartyStruct.addr], defaults.partyA_addr);
      });
    });
  });

  it("should set partyA's deposit to 0", function () {
    return BrehonContract.deployed().then(function (brehonContract) {
      return brehonContract.partyA.call().then(function (partyA) {
        assert.equal(partyA[PartyStruct.deposit].valueOf(), 0);
      });
    });
  });

  it("should set partyA's contractAccepted to false", function () {
    return BrehonContract.deployed().then(function (brehonContract) {
      return brehonContract.partyA.call().then(function (partyA) {
        assert.equal(partyA[PartyStruct.contractAccepted], false);
      });
    });
  });

  it("should set partyA's primaryBrehonApproval to false", function () {
    return BrehonContract.deployed().then(function (brehonContract) {
      return brehonContract.partyA.call().then(function (partyA) {
        assert.equal(partyA[PartyStruct.primaryBrehonApproval], false);
      });
    });
  });

  it("should set partyA's secondaryBrehonApproval to false", function () {
    return BrehonContract.deployed().then(function (brehonContract) {
      return brehonContract.partyA.call().then(function (partyA) {
        assert.equal(partyA[PartyStruct.secondaryBrehonApproval], false);
      });
    });
  });

  it("should set partyA's tertiaryBrehonApproval to false", function () {
    return BrehonContract.deployed().then(function (brehonContract) {
      return brehonContract.partyA.call().then(function (partyA) {
        assert.equal(partyA[PartyStruct.tertiaryBrehonApproval], false);
      });
    });
  });

  it("should set partyB's address properly", function () {
    return BrehonContract.deployed().then(function (brehonContract) {
      return brehonContract.partyB.call().then(function (partyB) {
        assert.equal(partyB[PartyStruct.addr], defaults.partyB_addr);
      });
    });
  });

  it("should set partyB's deposit to 0", function () {
    return BrehonContract.deployed().then(function (brehonContract) {
      return brehonContract.partyB.call().then(function (partyB) {
        assert.equal(partyB[PartyStruct.deposit].valueOf(), 0);
      });
    });
  });

  it("should set partyB's contractAccepted to false", function () {
    return BrehonContract.deployed().then(function (brehonContract) {
      return brehonContract.partyB.call().then(function (partyB) {
        assert.equal(partyB[PartyStruct.contractAccepted], false);
      });
    });
  });

  it("should set partyB's primaryBrehonApproval to false", function () {
    return BrehonContract.deployed().then(function (brehonContract) {
      return brehonContract.partyB.call().then(function (partyB) {
        assert.equal(partyB[PartyStruct.primaryBrehonApproval], false);
      });
    });
  });

  it("should set partyB's secondaryBrehonApproval to false", function () {
    return BrehonContract.deployed().then(function (brehonContract) {
      return brehonContract.partyB.call().then(function (partyB) {
        assert.equal(partyB[PartyStruct.secondaryBrehonApproval], false);
      });
    });
  });

  it("should set partyB's tertiaryBrehonApproval to false", function () {
    return BrehonContract.deployed().then(function (brehonContract) {
      return brehonContract.partyB.call().then(function (partyB) {
        assert.equal(partyB[PartyStruct.tertiaryBrehonApproval], false);
      });
    });
  });

  it("should set primaryBrehon's address properly", function () {
    return BrehonContract.deployed().then(function (brehonContract) {
      return brehonContract.primaryBrehon.call().then(function (primaryBrehon) {
        assert.equal(primaryBrehon[BrehonStruct.addr], defaults.primaryBrehon_addr);
      });
    });
  });

  it("should set primaryBrehon's contractAcceptance to false", function () {
    return BrehonContract.deployed().then(function (brehonContract) {
      return brehonContract.primaryBrehon.call().then(function (primaryBrehon) {
        assert.equal(primaryBrehon[BrehonStruct.contractAccepted], false);
      });
    });
  });

  it("should set primaryBrehon's fixedFee properly", function () {
    return BrehonContract.deployed().then(function (brehonContract) {
      return brehonContract.primaryBrehon.call().then(function (primaryBrehon) {
        assert.equal(primaryBrehon[BrehonStruct.fixedFee].valueOf(), defaults.primaryBrehon_fixedFee);
      });
    });
  });

  it("should set primaryBrehon's disputeFee properly", function () {
    return BrehonContract.deployed().then(function (brehonContract) {
      return brehonContract.primaryBrehon.call().then(function (primaryBrehon) {
        assert.equal(primaryBrehon[BrehonStruct.disputeFee].valueOf(), defaults.primaryBrehon_disputeFee);
      });
    });
  });

  it("should set secondaryBrehon's address properly", function () {
    return BrehonContract.deployed().then(function (brehonContract) {
      return brehonContract.secondaryBrehon.call().then(function (secondaryBrehon) {
        assert.equal(secondaryBrehon[BrehonStruct.addr], defaults.secondaryBrehon_addr);
      });
    });
  });

  it("should set secondaryBrehon's contractAcceptance to false", function () {
    return BrehonContract.deployed().then(function (brehonContract) {
      return brehonContract.secondaryBrehon.call().then(function (secondaryBrehon) {
        assert.equal(secondaryBrehon[BrehonStruct.contractAccepted], false);
      });
    });
  });

  it("should set secondaryBrehon's fixedFee properly", function () {
    return BrehonContract.deployed().then(function (brehonContract) {
      return brehonContract.secondaryBrehon.call().then(function (secondaryBrehon) {
        assert.equal(secondaryBrehon[BrehonStruct.fixedFee].valueOf(), defaults.secondaryBrehon_fixedFee);
      });
    });
  });

  it("should set secondaryBrehon's disputeFee properly", function () {
    return BrehonContract.deployed().then(function (brehonContract) {
      return brehonContract.secondaryBrehon.call().then(function (secondaryBrehon) {
        assert.equal(secondaryBrehon[BrehonStruct.disputeFee].valueOf(), defaults.secondaryBrehon_disputeFee);
      });
    });
  });

  it("should set tertiaryBrehon's address properly", function () {
    return BrehonContract.deployed().then(function (brehonContract) {
      return brehonContract.tertiaryBrehon.call().then(function (tertiaryBrehon) {
        assert.equal(tertiaryBrehon[BrehonStruct.addr], defaults.tertiaryBrehon_addr);
      });
    });
  });

  it("should set tertiaryBrehon's contractAcceptance to false", function () {
    return BrehonContract.deployed().then(function (brehonContract) {
      return brehonContract.tertiaryBrehon.call().then(function (tertiaryBrehon) {
        assert.equal(tertiaryBrehon[BrehonStruct.contractAccepted], false);
      });
    });
  });

  it("should set tertiaryBrehon's fixedFee to " + defaults.tertiaryBrehon_fixedFee, function () {
    return BrehonContract.deployed().then(function (brehonContract) {
      return brehonContract.tertiaryBrehon.call().then(function (tertiaryBrehon) {
        assert.equal(tertiaryBrehon[BrehonStruct.fixedFee].valueOf(), defaults.tertiaryBrehon_fixedFee);
      });
    });
  });

  it("should set tertiaryBrehon's disputeFee properly", function () {
    return BrehonContract.deployed().then(function (brehonContract) {
      return brehonContract.tertiaryBrehon.call().then(function (tertiaryBrehon) {
        assert.equal(tertiaryBrehon[BrehonStruct.disputeFee].valueOf(), defaults.tertiaryBrehon_disputeFee);
      });
    });
  });
});

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

contract('BrehonContract should allow startContract to start the contract', function (accounts) {
  it('by partyA', function () {
    var brehonContract;
    return BrehonContract.deployed().then(function (instance) {
      brehonContract = instance;
      return brehonContract.deposit({from: defaults.partyA_addr, value: getMinimumContractAmt(defaults)});
    }).then(function () {
      return brehonContract.startContract({from: defaults.partyA_addr});
    }).then(function (result) {
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
      assert.isNull(err, "Exception was thrown when a partyA tried to start the contract");
    });
  });
});
