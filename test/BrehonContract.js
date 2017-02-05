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

contract('BrehonContract acceptContract method', function (accounts) {
  it('should allow partyA to accept the contract', function () {
    var brehonContract;
    return BrehonContract.deployed().then(function (instance) {
      brehonContract = instance;
      return brehonContract.acceptContract(defaults.partyA_addr);
    }).then(function () {
      return brehonContract.partyB.call().then(function (partyB) {
        assert.equal(partyB[PartyStruct.contractAccepted], false);
      });
    }).then(function () {
      return brehonContract.primaryBrehon.call().then(function (primaryBrehon) {
        assert.equal(primaryBrehon[BrehonStruct.contractAccepted], false);
      });
    }).then(function () {
      return brehonContract.secondaryBrehon.call().then(function (secondaryBrehon) {
        assert.equal(secondaryBrehon[BrehonStruct.contractAccepted], false);
      });
    }).then(function () {
      return brehonContract.tertiaryBrehon.call().then(function (tertiaryBrehon) {
        assert.equal(tertiaryBrehon[BrehonStruct.contractAccepted], false);
      });
    }).then(function () {
      return brehonContract.partyA.call().then(function (partyA) {
        assert.equal(partyA[PartyStruct.contractAccepted], true);
      });
    });
  });
});
