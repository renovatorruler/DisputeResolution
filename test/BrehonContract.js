contract('BrehonContract', function (accounts) {
  it('should set appealLevel to -1', function () {
    var brehonContract = BrehonContract.deployed();
    return brehonContract.appealLevel.call().then(function (appealLevel) {
      assert(appealLevel.valueOf(), -1);
    });
  });

  it("should set partyA's address properly", function () {
    var brehonContract = BrehonContract.deployed();
    brehonContract.partyA.call().then(function (partyA) {
      assert(partyA[0], accounts[0]);
    });
  });

  it("should set partyA's deposit to 0", function () {
    var brehonContract = BrehonContract.deployed();
    brehonContract.partyA.call().then(function (partyA) {
      assert(partyA[1].valueOf(), 0);
    });
  });

  it("should set partyA's contractAccepted to false", function () {
    var brehonContract = BrehonContract.deployed();
    brehonContract.partyA.call().then(function (partyA) {
      console.log(partyA[2]);
      assert(partyA[2], false);
    });
  });

  it("should set partyA' primaryBrehonApproval to false", function () {
    var brehonContract = BrehonContract.deployed();
    brehonContract.partyA.call().then(function (partyA) {
      assert(partyA[3], false);
    });
  });

  it("should set partyA's secondaryBrehonApproval to false", function () {
    var brehonContract = BrehonContract.deployed();
    brehonContract.partyA.call().then(function (partyA) {
      assert(partyA[4], false);
    });
  });

  it("should set partyA's tertiaryBrehonApproval to false", function () {
    var brehonContract = BrehonContract.deployed();
    brehonContract.partyA.call().then(function (partyA) {
      assert(partyA[5], false);
    });
  });
});
