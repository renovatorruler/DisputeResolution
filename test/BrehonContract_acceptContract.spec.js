const BrehonContract = require('../app/javascripts/BrehonAPI.js');
const defaults = require('../config/deployment_settings.js').defaults;

const contractHelpers = require('../lib/contractHelpers.js');

const startContract = contractHelpers.startContract;
const getMinimumContractAmt = contractHelpers.getMinimumContractAmt;
const PartyStruct = contractHelpers.PartyStruct;
const BrehonStruct = contractHelpers.BrehonStruct;

contract('BrehonContract acceptContract method should allow partyA to accept the contract', () =>
  it('by only setting partyA\'s contractAccepted to true', () => {
    let brehonContract;
    return BrehonContract.deployed().then((instance) => {
      brehonContract = instance;
      return brehonContract.acceptContract({ from: defaults.partyA_addr });
    }).then(() =>
      brehonContract.partyB.call().then(partyB =>
        assert.equal(partyB[PartyStruct.contractAccepted], false,
          'partyB\'s contractAccepted is incorrectly set to true')))
    .then(() =>
      brehonContract.primaryBrehon.call().then(primaryBrehon =>
        assert.equal(primaryBrehon[BrehonStruct.contractAccepted], false,
          'primaryBrehon\'s contractAccepted is incorrectly set to true')))
    .then(() =>
      brehonContract.secondaryBrehon.call().then(secondaryBrehon =>
        assert.equal(secondaryBrehon[BrehonStruct.contractAccepted], false,
          'secondaryBrehon\'s contractAccepted is incorrectly set to true')))
    .then(() =>
      brehonContract.tertiaryBrehon.call().then(tertiaryBrehon =>
        assert.equal(tertiaryBrehon[BrehonStruct.contractAccepted], false,
          'tertiaryBrehon\'s contractAccepted is incorrectly set to true')))
    .then(() =>
      brehonContract.partyA.call().then(partyA =>
        assert.equal(partyA[PartyStruct.contractAccepted], true,
          'partyA\'s contractAccepted is incorrectly set to false')));
  }));

contract('BrehonContract acceptContract method should allow partyB to accept the contract', () =>
  it('by only setting partyB\'s contractAccepted to true', () => {
    let brehonContract;
    return BrehonContract.deployed().then((instance) => {
      brehonContract = instance;
      return brehonContract.acceptContract({ from: defaults.partyB_addr });
    }).then(() =>
      brehonContract.partyA.call().then(partyA =>
        assert.equal(partyA[PartyStruct.contractAccepted], false,
          'partyA\'s contractAccepted is incorrectly set to true')))
    .then(() =>
      brehonContract.partyB.call().then(partyB =>
        assert.equal(partyB[PartyStruct.contractAccepted], true,
          'partyB\'s contractAccepted is incorrectly set to false')))
    .then(() =>
      brehonContract.primaryBrehon.call().then(primaryBrehon =>
        assert.equal(primaryBrehon[BrehonStruct.contractAccepted], false,
          'primaryBrehon\'s contractAccepted is incorrectly set to true')))
    .then(() =>
      brehonContract.secondaryBrehon.call().then(secondaryBrehon =>
        assert.equal(secondaryBrehon[BrehonStruct.contractAccepted], false,
          'secondaryBrehon\'s contractAccepted is incorrectly set to true')))
    .then(() =>
      brehonContract.tertiaryBrehon.call().then(tertiaryBrehon =>
        assert.equal(tertiaryBrehon[BrehonStruct.contractAccepted], false,
          'tertiaryBrehon\'s contractAccepted is incorrectly set to true')));
  }));

contract('BrehonContract acceptContract method should allow primaryBrehon to accept the contract', () =>
  it('by only setting primaryBrehon\'s contractAccepted to true', () => {
    let brehonContract;
    return BrehonContract.deployed().then((instance) => {
      brehonContract = instance;
      return brehonContract.acceptContract({ from: defaults.primaryBrehon_addr });
    }).then(() =>
      brehonContract.partyA.call().then(partyA =>
        assert.equal(partyA[PartyStruct.contractAccepted], false,
          'partyA\'s contractAccepted is incorrectly set to true')))
    .then(() =>
      brehonContract.partyB.call().then(partyB =>
        assert.equal(partyB[PartyStruct.contractAccepted], false,
          'partyB\'s contractAccepted is incorrectly set to true')))
    .then(() =>
      brehonContract.primaryBrehon.call().then(primaryBrehon =>
        assert.equal(primaryBrehon[BrehonStruct.contractAccepted], true,
          'primaryBrehon\'s contractAccepted is incorrectly set to false')))
    .then(() =>
      brehonContract.secondaryBrehon.call().then(secondaryBrehon =>
        assert.equal(secondaryBrehon[BrehonStruct.contractAccepted], false,
          'secondaryBrehon\'s contractAccepted is incorrecty set to true')))
    .then(() =>
      brehonContract.tertiaryBrehon.call().then(tertiaryBrehon =>
        assert.equal(tertiaryBrehon[BrehonStruct.contractAccepted], false,
          'tertiaryBrehon\'s contractAccepted is incorrectly set to true')));
  }));

contract('BrehonContract acceptContract method should allow secondaryBrehon to accept the contract', () =>
  it('by only setting secondaryBrehon\'s contractAccepted to true', () => {
    let brehonContract;
    return BrehonContract.deployed().then((instance) => {
      brehonContract = instance;
      brehonContract.acceptContract({ from: defaults.secondaryBrehon_addr });
    }).then(() =>
      brehonContract.partyA.call().then(partyA =>
        assert.equal(partyA[PartyStruct.contractAccepted], false,
          'partyA\'s contractAccepted is incorrectly set to true')))
    .then(() =>
      brehonContract.partyB.call().then(partyB =>
        assert.equal(partyB[PartyStruct.contractAccepted], false,
          'partyB\'s contractAccepted is incorrectly set to true')))
    .then(() =>
      brehonContract.primaryBrehon.call().then(primaryBrehon =>
        assert.equal(primaryBrehon[BrehonStruct.contractAccepted], false,
          'primaryBrehon\'s contractAccepted is incorrectly set to true')))
    .then(() =>
      brehonContract.secondaryBrehon.call().then(secondaryBrehon =>
        assert.equal(secondaryBrehon[BrehonStruct.contractAccepted], true,
          'secondaryBrehon\'s contractAccepted is incorrectly set to false')))
    .then(() =>
      brehonContract.tertiaryBrehon.call().then(tertiaryBrehon =>
        assert.equal(tertiaryBrehon[BrehonStruct.contractAccepted], false,
          'tertiaryBrehon\'s contractAccepted is incorrectly set to true')));
  }));

contract('BrehonContract acceptContract method should allow tertiaryBrehon to accept the contract', () =>
  it('by only setting tertiaryBrehon\'s contractAccepted to true', () => {
    let brehonContract;
    return BrehonContract.deployed().then((instance) => {
      brehonContract = instance;
      return brehonContract.acceptContract({ from: defaults.tertiaryBrehon_addr });
    }).then(() =>
      brehonContract.partyA.call().then(partyA =>
        assert.equal(partyA[PartyStruct.contractAccepted], false,
          'partyA\'s contractAccepted is incorrectly set to true')))
    .then(() =>
      brehonContract.partyB.call().then(partyB =>
        assert.equal(partyB[PartyStruct.contractAccepted], false,
          'partyB\'s contractAccepted is incorrectly set to true')))
    .then(() =>
      brehonContract.primaryBrehon.call().then(primaryBrehon =>
        assert.equal(primaryBrehon[BrehonStruct.contractAccepted], false,
          'primaryBrehon\'s contractAccepted is incorrectly set to true')))
    .then(() =>
      brehonContract.secondaryBrehon.call().then(secondaryBrehon =>
        assert.equal(secondaryBrehon[BrehonStruct.contractAccepted], false,
          'secondaryBrehon\'s contractAccepted is incorrectly set to true')))
    .then(() =>
      brehonContract.tertiaryBrehon.call().then(tertiaryBrehon =>
        assert.equal(tertiaryBrehon[BrehonStruct.contractAccepted], true,
          'tertiaryBrehon\'s contractAccepted is incorrectly set to false')));
  }));

contract('BrehonContract acceptContract method should not allow someone else to accept the contract', accounts =>
  it('by throwing an exception', () => {
    let brehonContract;
    return BrehonContract.deployed().then((instance) => {
      brehonContract = instance;
      return brehonContract.acceptContract({ from: accounts[6] });
    }).then(() =>
      brehonContract.partyA.call().then(partyA =>
        assert.equal(partyA[PartyStruct.contractAccepted], false,
          'partyA\'s contractAccepted is incorrectly set to true')))
    .then(() =>
      brehonContract.partyB.call().then(partyB =>
        assert.equal(partyB[PartyStruct.contractAccepted], false,
          'partyB\'s contractAccepted is incorrectly set to true')))
    .then(() =>
      brehonContract.primaryBrehon.call().then(primaryBrehon =>
        assert.equal(primaryBrehon[BrehonStruct.contractAccepted], false,
          'primaryBrehon\'s contractAccepted is incorrectly set to true')))
    .then(() =>
      brehonContract.secondaryBrehon.call().then(secondaryBrehon =>
        assert.equal(secondaryBrehon[BrehonStruct.contractAccepted], false,
          'secondaryBrehon\'s contractAccepted is incorrectly set to true')))
    .then(() =>
      brehonContract.tertiaryBrehon.call().then(tertiaryBrehon =>
        assert.equal(tertiaryBrehon[BrehonStruct.contractAccepted], false,
          'tertiaryBrehon\'s contractAccepted is incorrectly set to true')))
    .catch(err =>
      assert.isNotNull(err, 'Exception was not thrown when an unregistered party tried to accept the contract'));
  }));

contract('BrehonContract acceptContract should ', () =>
  it('only be executed at Negotiation stage', () => {
    let brehonContract;
    return BrehonContract.deployed()
      .then(function captureReference(instance) {
        brehonContract = instance;
        return instance;
      })
      .then(startContract([{
        addr: defaults.partyB_addr,
        value: getMinimumContractAmt(defaults) }])(defaults.partyB_addr))
      .then(() =>
        brehonContract.acceptContract({ from: defaults.partyA_addr }))
    .catch(err =>
      assert.isNotNull(err, 'Exception was not thrown when acceptContract was triggerred at a stage which was not Negotiation stage'))
  })
);
