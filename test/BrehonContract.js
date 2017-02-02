contract('BrehonContract', function (accounts) {
  it('should set appealLevel to -1', function () {
    var brehonContract = BrehonContract.deployed();
    return brehonContract.appealLevel.call().then(function (appealLevel) {
      assert(appealLevel.valueOf(), -1);
    });
  });

  it('should set partys properly', function () {
    var brehonContract = BrehonContract.deployed();
    brehonContract.partyA.call().then(function (partyA) {
      console.log(partyA);
      //assert(appealLevel.valueOf(), -1);
    });
  });
});
