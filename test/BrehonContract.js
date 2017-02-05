var BrehonContract = artifacts.require("./BrehonContract.sol");
var defaults = require('../config/deployment_settings.js').defaults;

contract('BrehonContract constructor', function (accounts) {
  it('should set appealLevel to -1', function () {
    return BrehonContract.deployed().then(function (instance) {
      return instance.appealLevel.call().then(function (appealLevel) {
        assert.equal(appealLevel.valueOf(), -1);
      });
    });
  });

  it('should set transactionAmount properly', function () {
    return BrehonContract.deployed().then(function (instance) {
      return instance.transactionAmount.call().then(function (transactionAmount) {
        assert.equal(transactionAmount.valueOf(), defaults.transactionAmount);
      });
    });
  });

  it('should set the stage properly', function () {
    return BrehonContract.deployed().then(function (instance) {
      return instance.stage.call().then(function (stage) {
        assert.equal(stage.valueOf(), 0);
      });
    });
  });

  it("should set partyA's address properly", function () {
    return BrehonContract.deployed().then(function (brehonContract) {
      return brehonContract.partyA.call().then(function (partyA) {
        assert.equal(partyA[0], defaults.partyA_addr);
      });
    });
  });

  it("should set partyA's deposit to 0", function () {
    return BrehonContract.deployed().then(function (brehonContract) {
      return brehonContract.partyA.call().then(function (partyA) {
        assert.equal(partyA[1].valueOf(), 0);
      });
    });
  });

  it("should set partyA's contractAccepted to false", function () {
    return BrehonContract.deployed().then(function (brehonContract) {
      return brehonContract.partyA.call().then(function (partyA) {
        assert.equal(partyA[2], false);
      });
    });
  });

  it("should set partyA's primaryBrehonApproval to false", function () {
    return BrehonContract.deployed().then(function (brehonContract) {
      return brehonContract.partyA.call().then(function (partyA) {
        assert.equal(partyA[3], false);
      });
    });
  });

  it("should set partyA's secondaryBrehonApproval to false", function () {
    return BrehonContract.deployed().then(function (brehonContract) {
      return brehonContract.partyA.call().then(function (partyA) {
        assert.equal(partyA[4], false);
      });
    });
  });

  it("should set partyA's tertiaryBrehonApproval to false", function () {
    return BrehonContract.deployed().then(function (brehonContract) {
      return brehonContract.partyA.call().then(function (partyA) {
        assert.equal(partyA[5], false);
      });
    });
  });

  it("should set partyB's address properly", function () {
    return BrehonContract.deployed().then(function (brehonContract) {
      return brehonContract.partyB.call().then(function (partyB) {
        assert.equal(partyB[0], defaults.partyB_addr);
      });
    });
  });

  it("should set partyB's deposit to 0", function () {
    return BrehonContract.deployed().then(function (brehonContract) {
      return brehonContract.partyB.call().then(function (partyB) {
        assert.equal(partyB[1].valueOf(), 0);
      });
    });
  });

  it("should set partyB's contractAccepted to false", function () {
    return BrehonContract.deployed().then(function (brehonContract) {
      return brehonContract.partyB.call().then(function (partyB) {
        assert.equal(partyB[2], false);
      });
    });
  });

  it("should set partyB's primaryBrehonApproval to false", function () {
    return BrehonContract.deployed().then(function (brehonContract) {
      return brehonContract.partyB.call().then(function (partyB) {
        assert.equal(partyB[3], false);
      });
    });
  });

  it("should set partyB's secondaryBrehonApproval to false", function () {
    return BrehonContract.deployed().then(function (brehonContract) {
      return brehonContract.partyB.call().then(function (partyB) {
        assert.equal(partyB[4], false);
      });
    });
  });

  it("should set partyB's tertiaryBrehonApproval to false", function () {
    return BrehonContract.deployed().then(function (brehonContract) {
      return brehonContract.partyB.call().then(function (partyB) {
        assert.equal(partyB[5], false);
      });
    });
  });

  it("should set primaryBrehon's address properly", function () {
    return BrehonContract.deployed().then(function (brehonContract) {
      return brehonContract.primaryBrehon.call().then(function (primaryBrehon) {
        assert.equal(primaryBrehon[0], defaults.primaryBrehon_addr);
      });
    });
  });

  it("should set primaryBrehon's contractAcceptance to false", function () {
    return BrehonContract.deployed().then(function (brehonContract) {
      return brehonContract.primaryBrehon.call().then(function (primaryBrehon) {
        assert.equal(primaryBrehon[1], false);
      });
    });
  });

  it("should set primaryBrehon's fixedFee properly", function () {
    return BrehonContract.deployed().then(function (brehonContract) {
      return brehonContract.primaryBrehon.call().then(function (primaryBrehon) {
        assert.equal(primaryBrehon[2].valueOf(), defaults.primaryBrehon_fixedFee);
      });
    });
  });

  it("should set primaryBrehon's disputeFee properly", function () {
    return BrehonContract.deployed().then(function (brehonContract) {
      return brehonContract.primaryBrehon.call().then(function (primaryBrehon) {
        assert.equal(primaryBrehon[3].valueOf(), defaults.primaryBrehon_disputeFee);
      });
    });
  });

  it("should set secondaryBrehon's address properly", function () {
    return BrehonContract.deployed().then(function (brehonContract) {
      return brehonContract.secondaryBrehon.call().then(function (secondaryBrehon) {
        assert.equal(secondaryBrehon[0], defaults.secondaryBrehon_addr);
      });
    });
  });

  it("should set secondaryBrehon's contractAcceptance to false", function () {
    return BrehonContract.deployed().then(function (brehonContract) {
      return brehonContract.secondaryBrehon.call().then(function (secondaryBrehon) {
        assert.equal(secondaryBrehon[1], false);
      });
    });
  });

  it("should set secondaryBrehon's fixedFee properly", function () {
    return BrehonContract.deployed().then(function (brehonContract) {
      return brehonContract.secondaryBrehon.call().then(function (secondaryBrehon) {
        assert.equal(secondaryBrehon[2].valueOf(), defaults.secondaryBrehon_fixedFee);
      });
    });
  });

  it("should set secondaryBrehon's disputeFee properly", function () {
    return BrehonContract.deployed().then(function (brehonContract) {
      return brehonContract.secondaryBrehon.call().then(function (secondaryBrehon) {
        assert.equal(secondaryBrehon[3].valueOf(), defaults.secondaryBrehon_disputeFee);
      });
    });
  });

  it("should set tertiaryBrehon's address properly", function () {
    return BrehonContract.deployed().then(function (brehonContract) {
      return brehonContract.tertiaryBrehon.call().then(function (tertiaryBrehon) {
        assert.equal(tertiaryBrehon[0], defaults.tertiaryBrehon_addr);
      });
    });
  });

  it("should set tertiaryBrehon's contractAcceptance to false", function () {
    return BrehonContract.deployed().then(function (brehonContract) {
      return brehonContract.tertiaryBrehon.call().then(function (tertiaryBrehon) {
        assert.equal(tertiaryBrehon[1], false);
      });
    });
  });

  it("should set tertiaryBrehon's fixedFee properly", function () {
    return BrehonContract.deployed().then(function (brehonContract) {
      return brehonContract.tertiaryBrehon.call().then(function (tertiaryBrehon) {
        assert.equal(tertiaryBrehon[2].valueOf(), defaults.tertiaryBrehon_fixedFee);
      });
    });
  });

  it("should set tertiaryBrehon's disputeFee properly", function () {
    return BrehonContract.deployed().then(function (brehonContract) {
      return brehonContract.tertiaryBrehon.call().then(function (tertiaryBrehon) {
        assert.equal(tertiaryBrehon[3].valueOf(), defaults.tertiaryBrehon_disputeFee);
      });
    });
  });
});

contract('BrehonContract constructor', function (accounts) {
  it('should set appealLevel to -1', function () {
    return BrehonContract.deployed().then(function (instance) {
      return instance.appealLevel.call().then(function (appealLevel) {
        assert.equal(appealLevel.valueOf(), -1);
      });
    });
  });
});
