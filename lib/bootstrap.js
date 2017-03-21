var BrehonContract = artifacts.require("./BrehonContract.sol");
var defaults = require('../config/deployment_settings.js').defaults;
var contractHelpers = require('../lib/contractHelpers.js');

var startContract = contractHelpers.startContract;
var getMinimumContractAmt = contractHelpers.getMinimumContractAmt;
var getSplitForPrimaryBrehon = contractHelpers.getPercentageSplit(defaults, 0);

module.exports = function (callback) {
  // perform actions
  const settlement = {
    partyA: getSplitForPrimaryBrehon(50),
    partyB: getSplitForPrimaryBrehon(50)
  };
  var brehonContract;
  return BrehonContract.deployed()
    .then(function captureReference(instance) {
      brehonContract = instance;
      return instance;
    })
    .then(startContract([{
      addr: defaults.partyA_addr,
      value: getMinimumContractAmt(defaults)
    }])(defaults.partyA_addr))
    .then(function proposeSettlement() {
      return brehonContract.proposeSettlement(
        settlement.partyA,
        settlement.partyB,
        { from: defaults.partyA_addr });
    })
    .then(function acceptSettlement() {
      return brehonContract.acceptSettlement(
        settlement.partyA,
        settlement.partyB,
        { from: defaults.partyB_addr });
    })
    .then(callback);
};
