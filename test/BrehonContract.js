var BrehonContract = artifacts.require("./BrehonContract.sol");

contract('BrehonContract constructor', function (accounts) {
  it('should set appealLevel to -1', function () {
    return BrehonContract.deployed().then(function (instance) {
      return instance.appealLevel.call().then(function (appealLevel) {
        assert.equal(appealLevel.valueOf(), -1);
      });
    });
  });

  it("should set partyA's address properly", function () {
    return BrehonContract.deployed().then(function (brehonContract) {
      return brehonContract.partyA.call().then(function (partyA) {
        assert.equal(partyA[0], accounts[0]);
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
        assert.equal(partyB[0], accounts[1]);
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
        assert.equal(primaryBrehon[0], accounts[2]);
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
        assert.equal(primaryBrehon[2].valueOf(), '100000000000000000');
      });
    });
  });

  it("should set primaryBrehon's disputeFee properly", function () {
    return BrehonContract.deployed().then(function (brehonContract) {
      return brehonContract.primaryBrehon.call().then(function (primaryBrehon) {
        assert.equal(primaryBrehon[3].valueOf(), '1000000000000000000');
      });
    });
  });

  it("should set secondaryBrehon's address properly", function () {
    return BrehonContract.deployed().then(function (brehonContract) {
      return brehonContract.secondaryBrehon.call().then(function (secondaryBrehon) {
        assert.equal(secondaryBrehon[0], accounts[3]);
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
        assert.equal(secondaryBrehon[2].valueOf(), '100000000000000000');
      });
    });
  });

  it("should set secondaryBrehon's disputeFee properly", function () {
    return BrehonContract.deployed().then(function (brehonContract) {
      return brehonContract.secondaryBrehon.call().then(function (secondaryBrehon) {
        assert.equal(secondaryBrehon[3].valueOf(), '1000000000000000000');
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
