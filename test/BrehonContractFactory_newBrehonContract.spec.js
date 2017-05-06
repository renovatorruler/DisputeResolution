const BrehonContractFactory = artifacts.require('./BrehonContractFactory.sol');
const BrehonContract = artifacts.require('./BrehonContract.sol');

const defaults = require('../config/deployment_settings.js').defaults;
const contractHelpers = require('../lib/contractHelpers.js');

const PartyStruct = contractHelpers.PartyStruct;
const BrehonStruct = contractHelpers.BrehonStruct;

contract.only('BrehonContractFactory newBrehonContract', () => {
  it('should deploy a new instance of BrehonContract', () => {
    let brehonContractFactory;
    let brehonContract;
    BrehonContractFactory.deployed()
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
        })
        .then((address) =>
          assert.match(address, /^0x[0-9a-f]{40}$/,
          'newBrehonContract did not return proper address'))
        .then(() => 
          brehonContract.partyA.call()
          .then(partyA =>
            assert.equal(partyA[PartyStruct.addr], defaults.partyA_addr,
              'BrehonContract was not created with correct partyA')))
        .then(() => 
          brehonContract.partyB.call()
          .then(partyB =>
            assert.equal(partyB[PartyStruct.addr], defaults.partyB_addr,
              'BrehonContract was not created with correct partyB')))
        .then(() => 
          brehonContract.primaryBrehon.call()
          .then(primaryBrehon =>
            assert.equal(primaryBrehon[BrehonStruct.addr], defaults.primaryBrehon_addr,
              'BrehonContract was not created with correct primaryBrehon')))
        .then(() => 
          brehonContract.secondaryBrehon.call()
          .then(secondaryBrehon =>
            assert.equal(secondaryBrehon[BrehonStruct.addr], defaults.secondaryBrehon_addr,
              'BrehonContract was not created with correct secondaryBrehon')))
        .then(() => 
          brehonContract.tertiaryBrehon.call()
          .then(tertiaryBrehon =>
            assert.equal(tertiaryBrehon[BrehonStruct.addr], defaults.tertiaryBrehon_addr,
              'BrehonContract was not created with correct tertiaryBrehon')))
        .then(() => 
          brehonContract.transactionAmount.call()
          .then(transactionAmount =>
            assert.equal(transactionAmount.valueOf(), defaults.transactionAmount,
              'BrehonContract was not created with proper transactionAmount')));
  });
});
