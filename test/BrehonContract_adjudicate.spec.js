const R = require('ramda');
const BigNumber = require('bignumber.js');

const BrehonContract = artifacts.require("./BrehonContract.sol");
const defaults = require('../config/deployment_settings.js').defaults;

const contractHelpers = require('../lib/contractHelpers.js');
const startContractAndRaiseDispute = contractHelpers.startContractAndRaiseDispute;
const getMinimumContractAmt = contractHelpers.getMinimumContractAmt;
const getSplitForPrimaryBrehon = contractHelpers.getPercentageSplit(defaults, 0);
const getSplitForSecondaryBrehon = contractHelpers.getPercentageSplit(defaults, 1);
const getSplitForTertiaryBrehon = contractHelpers.getPercentageSplit(defaults, 2);

contract('BrehonContract should allow primaryBrehon to adjudicate the contract', (accounts) => {
  it('in the favor of partyA completely', () => {
    var brehonContract;
    return BrehonContract.deployed()
      .then(function captureReference(instance) {
        brehonContract = instance;
        return instance;
      })
      .then(startContractAndRaiseDispute(
        [{
          addr: defaults.partyA_addr,
          value: getMinimumContractAmt(defaults)
        }], defaults.partyA_addr, defaults.partyA_addr))
      .then(() => {
        return brehonContract.adjudicate(
            getSplitForPrimaryBrehon(100),
            getSplitForPrimaryBrehon(0),
            {from: defaults.primaryBrehon_addr}
        );
      })
      .then(() => {
        return brehonContract.stage.call().then((stage) => {
            assert.equal(stage.valueOf(), 4, "stage is not set to Stages.AppealPeriod");
        });
      })
      .catch((err) => {
        assert.isNull(err, "Exception was thrown when primaryBrehon tried to adjudicate a dispute");
      });
  });
});
