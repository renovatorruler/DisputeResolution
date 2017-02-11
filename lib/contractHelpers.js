var R = require('ramda');
var BigNumber = require('bignumber.js');
var defaults = require('../config/deployment_settings.js').defaults;

var getMinimumContractAmt = function getMinimumContractAmt(contract_settings) {
    return new BigNumber(contract_settings.transactionAmount)
      .add(new BigNumber(contract_settings.primaryBrehon_fixedFee))
      .add(new BigNumber(contract_settings.primaryBrehon_disputeFee))
      .add(new BigNumber(contract_settings.secondaryBrehon_fixedFee))
      .add(new BigNumber(contract_settings.secondaryBrehon_disputeFee))
      .add(new BigNumber(contract_settings.tertiaryBrehon_fixedFee))
      .add(new BigNumber(contract_settings.tertiaryBrehon_disputeFee)).valueOf();
};

var startContract = R.curry(function startContract(party_contributions, starting_party_addr, brehonContract) {
  return Promise.all(R.map(function(party_tuple) {
    return brehonContract.deposit({
      from: party_tuple.addr,
      value: R.defaultTo(getMinimumContractAmt(defaults), party_tuple.value)
    });
  }, party_contributions))
    .then(function () {
      return brehonContract.startContract({
        from: R.defaultTo(R.head(party_contributions), starting_party_addr)
      });
    });
});

module.exports = {
  startContract,
  getMinimumContractAmt
}
