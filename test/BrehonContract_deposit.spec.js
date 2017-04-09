const BrehonContract = artifacts.require('./BrehonContract.sol');
const defaults = require('../config/deployment_settings.js').defaults;

const contractHelpers = require('../lib/contractHelpers.js');

const PartyStruct = contractHelpers.PartyStruct;

contract('BrehonContract should accept funds from partyA', () => {
  it('by correctly setting partyA\'s deposit', () => {
    let brehonContract;
    return BrehonContract.deployed().then((instance) => {
      brehonContract = instance;
      return brehonContract.deposit(
        { from: defaults.partyA_addr, value: defaults.transactionAmount });
    })
    .then(() =>
      brehonContract.partyA.call().then(partyA =>
        assert.equal(partyA[PartyStruct.deposit].valueOf(), defaults.transactionAmount,
          'partyA\'s contractAccepted is incorrectly set')))
    .then(() =>
      brehonContract.partyB.call().then((partyB) =>
        assert.equal(partyB[PartyStruct.deposit].valueOf(), 0,
        'partyB\'s contractAccepted is incorrectly set')));
  });
});

contract('BrehonContract should accept funds from partyB', () => {
  it('by correctly setting partyB\'s deposit', () => {
    let brehonContract;
    return BrehonContract.deployed().then((instance) => {
      brehonContract = instance;
      return brehonContract.deposit({
        from: defaults.partyB_addr,
        value: defaults.transactionAmount,
      });
    })
    .then(() =>
      brehonContract.partyA.call().then(partyA =>
        assert.equal(partyA[PartyStruct.deposit].valueOf(), 0,
          'partyA\'s contractAccepted is incorrectly set')))
    .then(() => brehonContract.partyB.call().then(partyB =>
        assert.equal(partyB[PartyStruct.deposit].valueOf(), defaults.transactionAmount,
          'partyB\'s contractAccepted is incorrectly set')));
  });
});

contract('BrehonContract shouldnt\'t accept funds from unauthorized addresses',
  (accounts) => {
    it('like from the primaryBrehon', () => {
      let brehonContract;
      return BrehonContract.deployed()
        .then(instance => {
          brehonContract = instance;
          return brehonContract.deposit({
            from: defaults.primaryBrehon_addr,
            value: defaults.transactionAmount,
          });
        })
        .then(() => brehonContract.partyA.call().then(partyA =>
          assert.equal(partyA[PartyStruct.deposit].valueOf(), 0,
            'partyA\'s contractAccepted is incorrectly set')))
        .then(() => brehonContract.partyB.call().then(partyB =>
          assert.equal(partyB[PartyStruct.deposit].valueOf(), 0,
            'partyB\'s contractAccepted is incorrectly set')))
        .catch(err => assert.isNotNull(err,
          'Exception was not thrown when a primaryBrehon tried to deposit funds to the contract'));
    });

    it('or from the secondaryBrehon', () => {
      let brehonContract;
      return BrehonContract.deployed()
        .then((instance) => {
          brehonContract = instance;
          return brehonContract.deposit({
            from: defaults.secondaryBrehon_addr,
            value: defaults.transactionAmount,
          });
        })
        .then(() => brehonContract.partyA.call().then(partyA =>
          assert.equal(partyA[PartyStruct.deposit].valueOf(), 0,
            'partyA\'s contractAccepted is incorrectly set')))
        .then(() => brehonContract.partyB.call().then(partyB =>
          assert.equal(partyB[PartyStruct.deposit].valueOf(), 0,
            'partyB\'s contractAccepted is incorrectly set')))
        .catch(err =>
          assert.isNotNull(err,
            'Exception was not thrown when a secondaryBrehon tried to deposit funds to the contract'));
    });

    it('or from the tertiaryBrehon', () => {
      let brehonContract;
      return BrehonContract.deployed().then((instance) => {
        brehonContract = instance;
        return brehonContract.deposit({ from: defaults.tertiaryBrehon_addr, value: defaults.transactionAmount });
      })
        .then(() => brehonContract.partyA.call()
          .then((partyA) => assert.equal(partyA[PartyStruct.deposit].valueOf(), 0,
            'partyA\'s contractAccepted is incorrectly set')))
        .then(() => {
          return brehonContract.partyB.call().then((partyB) => {
            assert.equal(partyB[PartyStruct.deposit].valueOf(), 0,
              'partyB\'s contractAccepted is incorrectly set');
          });
        }).catch((err) => {
          assert.isNotNull(err, 'Exception was not thrown when a tertiaryBrehon tried to deposit funds to the contract');
        });
    });

    it('or from a rando', () => {
      let brehonContract;
      return BrehonContract.deployed().then((instance) => {
        brehonContract = instance;
        return brehonContract.deposit({ from: accounts[6], value: defaults.transactionAmount });
      }).then(() => {
        return brehonContract.partyA.call().then((partyA) => {
          assert.equal(partyA[PartyStruct.deposit].valueOf(), 0,
            'partyA\'s contractAccepted is incorrectly set');
        });
      }).then(() => {
        return brehonContract.partyB.call().then((partyB) => {
          assert.equal(partyB[PartyStruct.deposit].valueOf(), 0,
            'partyB\'s contractAccepted is incorrectly set');
        });
      }).catch((err) => {
        assert.isNotNull(err, 'Exception was not thrown when a rando tried to deposit funds to the contract');
      });
    });
  });
