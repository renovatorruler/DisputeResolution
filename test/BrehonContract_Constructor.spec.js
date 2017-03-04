const BrehonContract = artifacts.require('./BrehonContract.sol');
const defaults = require('../config/deployment_settings.js').defaults;

const contractHelpers = require('../lib/contractHelpers.js');

const PartyStruct = contractHelpers.PartyStruct;
const BrehonStruct = contractHelpers.BrehonStruct;

contract('BrehonContract constructor', () => {
  it('should set appealLevel to -1', () =>
    BrehonContract.deployed().then(instance =>
      instance.appealLevel.call().then(appealLevel =>
        assert.equal(appealLevel.valueOf(), -1))));

  it(`should set transactionAmount to ${defaults.transactionAmount}`, () =>
    BrehonContract.deployed().then(instance =>
      instance.transactionAmount.call().then(transactionAmount =>
        assert.equal(transactionAmount.valueOf(), defaults.transactionAmount))));

  it(`should set contractTermsHash to ${defaults.contractTermsHash}`, () =>
    BrehonContract.deployed().then(instance =>
      instance.contractTermsHash.call().then(contractTermsHash =>
        assert.equal(contractTermsHash.valueOf(), defaults.contractTermsHash))));

  it('should set the stage to Negotiation', () =>
    BrehonContract.deployed().then(instance =>
      instance.stage.call().then(stage =>
        assert.equal(stage.valueOf(), 0))));

  it('should set partyA\'s address properly', () =>
    BrehonContract.deployed().then(brehonContract =>
      brehonContract.partyA.call().then(partyA =>
        assert.equal(partyA[PartyStruct.addr], defaults.partyA_addr))));

  it('should set partyA\'s deposit to 0', () =>
    BrehonContract.deployed().then(brehonContract =>
      brehonContract.partyA.call().then(partyA =>
        assert.equal(partyA[PartyStruct.deposit].valueOf(), 0))));

  it('should set partyA\'s contractAccepted to false', () =>
    BrehonContract.deployed().then(brehonContract =>
      brehonContract.partyA.call().then(partyA =>
        assert.equal(partyA[PartyStruct.contractAccepted], false))));

  it('should set primaryBrehon\'s address properly', () =>
    BrehonContract.deployed().then(brehonContract =>
      brehonContract.primaryBrehon.call().then(primaryBrehon =>
        assert.equal(primaryBrehon[BrehonStruct.addr], defaults.primaryBrehon_addr))));

  it('should set primaryBrehon\'s contractAcceptance to false', () =>
    BrehonContract.deployed().then(brehonContract =>
      brehonContract.primaryBrehon.call().then(primaryBrehon =>
        assert.equal(primaryBrehon[BrehonStruct.contractAccepted], false))));

  it('should set primaryBrehon\'s fixedFee properly', () =>
    BrehonContract.deployed().then(brehonContract =>
      brehonContract.primaryBrehon.call().then(primaryBrehon =>
        assert.equal(primaryBrehon[BrehonStruct.fixedFee].valueOf(),
          defaults.primaryBrehon_fixedFee))));

  it('should set primaryBrehon\'s disputeFee properly', () =>
    BrehonContract.deployed().then(brehonContract =>
      brehonContract.primaryBrehon.call().then(primaryBrehon =>
        assert.equal(primaryBrehon[BrehonStruct.disputeFee].valueOf(),
          defaults.primaryBrehon_disputeFee))));

  it('should set secondaryBrehon\'s address properly', () =>
    BrehonContract.deployed().then(brehonContract =>
      brehonContract.secondaryBrehon.call().then(secondaryBrehon =>
        assert.equal(secondaryBrehon[BrehonStruct.addr],
          defaults.secondaryBrehon_addr))));

  it('should set secondaryBrehon\'s contractAcceptance to false', () =>
    BrehonContract.deployed().then(brehonContract =>
      brehonContract.secondaryBrehon.call().then(secondaryBrehon =>
        assert.equal(secondaryBrehon[BrehonStruct.contractAccepted], false))));

  it('should set secondaryBrehon\'s fixedFee properly', () =>
    BrehonContract.deployed().then(brehonContract =>
      brehonContract.secondaryBrehon.call().then(secondaryBrehon =>
        assert.equal(secondaryBrehon[BrehonStruct.fixedFee].valueOf(),
          defaults.secondaryBrehon_fixedFee))));

  it('should set secondaryBrehon\'s disputeFee properly', () =>
    BrehonContract.deployed().then(brehonContract =>
      brehonContract.secondaryBrehon.call().then(secondaryBrehon =>
        assert.equal(secondaryBrehon[BrehonStruct.disputeFee].valueOf(),
          defaults.secondaryBrehon_disputeFee))));

  it('should set tertiaryBrehon\'s address properly', () =>
    BrehonContract.deployed().then(brehonContract =>
      brehonContract.tertiaryBrehon.call().then(tertiaryBrehon =>
        assert.equal(tertiaryBrehon[BrehonStruct.addr], defaults.tertiaryBrehon_addr))));

  it('should set tertiaryBrehon\'s contractAcceptance to false', () =>
    BrehonContract.deployed().then(brehonContract =>
      brehonContract.tertiaryBrehon.call().then(tertiaryBrehon =>
        assert.equal(tertiaryBrehon[BrehonStruct.contractAccepted], false))));

  it(`should set tertiaryBrehon's fixedFee to ${defaults.tertiaryBrehon_fixedFee}`, () =>
    BrehonContract.deployed().then(brehonContract =>
      brehonContract.tertiaryBrehon.call().then(tertiaryBrehon =>
        assert.equal(tertiaryBrehon[BrehonStruct.fixedFee].valueOf(),
          defaults.tertiaryBrehon_fixedFee))));

  it('should set tertiaryBrehon\'s disputeFee properly', () =>
    BrehonContract.deployed().then(brehonContract =>
      brehonContract.tertiaryBrehon.call().then(tertiaryBrehon =>
        assert.equal(tertiaryBrehon[BrehonStruct.disputeFee].valueOf(),
          defaults.tertiaryBrehon_disputeFee))));
});
