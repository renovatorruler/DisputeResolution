const R = require('ramda');
const BigNumber = require('bignumber.js');
const defaults = require('../config/deployment_settings.js').defaults;

const PartyStruct = {
  addr: 0,
  deposit: 1,
  contractAccepted: 2,
  primaryBrehonApproval: 3,
  secondaryBrehonApproval: 4,
  tertiaryBrehonApproval: 5
};

const BrehonStruct = {
  addr: 0,
  contractAccepted: 1,
  fixedFee: 2,
  disputeFee: 3
};

const getMinimumContractAmt = function getMinimumContractAmt(contract_settings) {
    return new BigNumber(contract_settings.transactionAmount)
      .add(new BigNumber(contract_settings.primaryBrehon_fixedFee))
      .add(new BigNumber(contract_settings.primaryBrehon_disputeFee))
      .add(new BigNumber(contract_settings.secondaryBrehon_fixedFee))
      .add(new BigNumber(contract_settings.secondaryBrehon_disputeFee))
      .add(new BigNumber(contract_settings.tertiaryBrehon_fixedFee))
      .add(new BigNumber(contract_settings.tertiaryBrehon_disputeFee)).valueOf();
};

const startContract = R.curry(function startContract(party_contributions, starting_party_addr, brehonContract) {
  return Promise.all(R.map((party_tuple) => {
    return brehonContract.deposit({
      from: party_tuple.addr,
      value: R.defaultTo(getMinimumContractAmt(defaults), party_tuple.value)
    });
  }, party_contributions))
    .then(() => {
      return brehonContract.startContract({
        from: R.defaultTo(R.head(party_contributions), starting_party_addr)
      });
    });
});

const raiseDispute = R.curry(function raiseDispute(disputing_party_addr, brehonContract) {
  return brehonContract.raiseDispute({
    from: disputing_party_addr
  });
});

const startContractAndRaiseDispute = R.curry(function startContractAndRaiseDispute(party_contributions, starting_party_addr, disputing_party_addr, brehonContract) {
    return startContract(party_contributions)(starting_party_addr)(brehonContract)
      .then(() => {
          return raiseDispute(disputing_party_addr)(brehonContract);
      });
});


module.exports = {
  startContract,
  startContractAndRaiseDispute,
  getMinimumContractAmt,
  PartyStruct,
  BrehonStruct
}
