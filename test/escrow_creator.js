contract('EscrowCreator', function(accounts) {
  it("should assert true", function(done) {
    var escrow_creator = EscrowCreator.at(EscrowCreator.deployed_address);
    assert.isTrue(true);
    done();
  });
});
