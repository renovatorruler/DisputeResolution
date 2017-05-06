const BrehonContractFactory = artifacts.require('./BrehonContractFactory.sol');
const BrehonContract = artifacts.require('./BrehonContract.sol');

const defaults = require('../config/deployment_settings.js').defaults;
const contractHelpers = require('../lib/contractHelpers.js');

const PartyStruct = contractHelpers.PartyStruct;
const BrehonStruct = contractHelpers.BrehonStruct;

contract.only('BrehonContractFactory newBrehonContract should deploy BrehonContract', () => {
  let brehonContractFactory;
  let brehonContract;

  beforeEach(() => {
    return BrehonContractFactory.deployed()
      .then(function captureReference(instance) {
        brehonContractFactory = instance;
        return instance;
      })
      .then(instance =>
        brehonContractFactory.newBrehonContract(
          defaults.partyA_addr,
          defaults.partyB_addr,
          defaults.transactionAmount,
          defaults.contractTermsHash,
          defaults.primaryBrehon_addr,
          defaults.primaryBrehon_fixedFee,
          defaults.primaryBrehon_disputeFee,
          defaults.secondaryBrehon_addr,
          defaults.secondaryBrehon_fixedFee,
          defaults.secondaryBrehon_disputeFee,
          defaults.tertiaryBrehon_addr,
          defaults.tertiaryBrehon_fixedFee,
          defaults.tertiaryBrehon_disputeFee,
          { from: defaults.partyA_addr }))
        .then(() =>
          brehonContractFactory
          .getBrehonContract.call(
            defaults.contractTermsHash,
            { from: defaults.partyA_addr }))
        .then(function captureBrehonContractAddress(address) {
          brehonContract = BrehonContract.at(address);
          return address;
        });
  });

  it('set partyA correctly', () =>
    brehonContract.partyA.call()
    .then(partyA => {
      assert.equal(partyA[PartyStruct.addr], defaults.partyA_addr,
        'BrehonContract was not created with correct address for partyA');
      assert.equal(partyA[PartyStruct.deposit].valueOf(), 0,
        'BrehonContract was not created with correct deposit partyA');
      assert.equal(partyA[PartyStruct.contractAccepted], false,
        'BrehonContract was not created with partyA\'s contractAccepted set to false');
    }));

  it('set partyB correctly', () =>
    brehonContract.partyB.call()
    .then(partyB => {
      assert.equal(partyB[PartyStruct.addr], defaults.partyB_addr,
        'BrehonContract was not created with correct address for partyB');
      assert.equal(partyB[PartyStruct.deposit].valueOf(), 0,
        'BrehonContract was not created with correct deposit partyB');
      assert.equal(partyB[PartyStruct.contractAccepted], false,
        'BrehonContract was not created with partyB\'s contractAccepted set to false');
    }));

  it('set primaryBrehon correctly', () =>
    brehonContract.primaryBrehon.call()
    .then(primaryBrehon => {
      assert.equal(primaryBrehon[BrehonStruct.addr], defaults.primaryBrehon_addr,
        'BrehonContract was not created with correct address for primaryBrehon');
      assert.equal(primaryBrehon[BrehonStruct.contractAccepted], false,
        'BrehonContract was not created with primaryBrehon\'s contractAccepted set to false');
      assert.equal(primaryBrehon[BrehonStruct.fixedFee].valueOf(), defaults.primaryBrehon_fixedFee,
        'BrehonContract was not created with correct fixedFee for primaryBrehon');
      assert.equal(primaryBrehon[BrehonStruct.disputeFee].valueOf(), defaults.primaryBrehon_disputeFee,
        'BrehonContract was not created with correct disputeFee for primaryBrehon');
    }));

  it('set secondaryBrehon correctly', () =>
    brehonContract.secondaryBrehon.call()
    .then(secondaryBrehon => {
      assert.equal(secondaryBrehon[BrehonStruct.addr], defaults.secondaryBrehon_addr,
        'BrehonContract was not created with correct address for secondaryBrehon');
      assert.equal(secondaryBrehon[BrehonStruct.contractAccepted], false,
        'BrehonContract was not created with secondaryBrehon\'s contractAccepted set to false');
      assert.equal(secondaryBrehon[BrehonStruct.fixedFee].valueOf(), defaults.secondaryBrehon_fixedFee,
        'BrehonContract was not created with correct fixedFee for secondaryBrehon');
      assert.equal(secondaryBrehon[BrehonStruct.disputeFee].valueOf(), defaults.secondaryBrehon_disputeFee,
        'BrehonContract was not created with correct disputeFee for secondaryBrehon');
    }));

  it('set tertiaryBrehon correctly', () =>
    brehonContract.tertiaryBrehon.call()
    .then(tertiaryBrehon => {
      assert.equal(tertiaryBrehon[BrehonStruct.addr], defaults.tertiaryBrehon_addr,
        'BrehonContract was not created with correct address for tertiaryBrehon');
      assert.equal(tertiaryBrehon[BrehonStruct.contractAccepted], false,
        'BrehonContract was not created with tertiaryBrehon\'s contractAccepted set to false');
      assert.equal(tertiaryBrehon[BrehonStruct.fixedFee].valueOf(), defaults.tertiaryBrehon_fixedFee,
        'BrehonContract was not created with correct fixedFee for tertiaryBrehon');
      assert.equal(tertiaryBrehon[BrehonStruct.disputeFee].valueOf(), defaults.tertiaryBrehon_disputeFee,
        'BrehonContract was not created with correct disputeFee for tertiaryBrehon');
    }));

  it(`set transactionAmount to ${defaults.transactionAmount}`, () =>
    brehonContract.transactionAmount.call()
    .then(transactionAmount =>
      assert.equal(transactionAmount.valueOf(), defaults.transactionAmount,
        'BrehonContract was not created with proper transactionAmount')));

  it(`set contractTermsHash to ${defaults.contractTermsHash}`, () =>
    brehonContract.contractTermsHash.call()
    .then(contractTermsHash =>
      assert.equal(contractTermsHash.valueOf(), defaults.contractTermsHash,
        'BrehonContract was not created with proper contractTermsHash')));
});
