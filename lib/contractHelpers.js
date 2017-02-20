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

const getMinimumContractAmt = (contract_settings) => {
    return new BigNumber(contract_settings.transactionAmount)
      .add(new BigNumber(contract_settings.primaryBrehon_fixedFee))
      .add(new BigNumber(contract_settings.primaryBrehon_disputeFee))
      .add(new BigNumber(contract_settings.secondaryBrehon_fixedFee))
      .add(new BigNumber(contract_settings.secondaryBrehon_disputeFee))
      .add(new BigNumber(contract_settings.tertiaryBrehon_fixedFee))
      .add(new BigNumber(contract_settings.tertiaryBrehon_disputeFee)).valueOf();
};

const getPercentageSplit = R.curry((contract_settings, appealLevel, percent) => {
    let totalAmount = new BigNumber(contract_settings.transactionAmount);
    if(appealLevel < 1) {
      totalAmount = totalAmount.add(new BigNumber(contract_settings.secondaryBrehon_disputeFee));
    }
    if(appealLevel < 2) {
      totalAmount = totalAmount.add(new BigNumber(contract_settings.tertiaryBrehon_disputeFee));
    }
    let splitAmount;
    if(percent < 0) {
        splitAmount = totalAmount - getPercentageSplit(contract_settings, appealLevel, percent * -1);
    } else {
         splitAmount = totalAmount.times(percent/100);
    }
    return splitAmount;
});

const partyAddresses = [
    defaults.partyA_addr,
    defaults.partyB_addr
];
const brehonAddresses = [
    defaults.primaryBrehon_addr,
    defaults.secondaryBrehon_addr,
    defaults.tertiaryBrehon_addr
];

const acceptContractByAll = (brehonContract) => {
    return R.reduce((acc, addr) => {
        return acc.then(() => {
          return brehonContract.acceptContract({from: addr});
        });
      },
      Promise.resolve(brehonContract),
      R.concat(partyAddresses, brehonAddresses)
    );
};

const verifyEvent = R.curry((eventName, expectedArgs, resultObj) => {
  const event = R.find(R.propEq('event', eventName), resultObj.logs);
  assert.isDefined(event, `${eventName} event was not emitted`);
  if (event) {
    R.mapObjIndexed((expectedArgValue, expectedArgName) => {
      let actual = event.args[expectedArgName];
      let expected = expectedArgValue;
      if (actual.toString) {
        actual = actual.toString();
        expected = expected.toString();
      }
      assert.equal(actual, expected, `${eventName} event did not correctly set ${expectedArgName}`);
    }, expectedArgs);
  }
  return resultObj;
});

const startContract = R.curry((party_contributions, starting_party_addr, brehonContract) => {
  return acceptContractByAll(brehonContract)
    .then(() => {
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
});

const raiseDispute = R.curry((disputing_party_addr, brehonContract) => {
  return brehonContract.raiseDispute({
    from: disputing_party_addr
  });
});

const startContractAndRaiseDispute = R.curry((party_contributions, starting_party_addr, disputing_party_addr, brehonContract) => {
    return startContract(party_contributions)(starting_party_addr)(brehonContract)
      .then(() => {
          return raiseDispute(disputing_party_addr)(brehonContract);
      });
});

const assertError = R.curry((message, err) => assert.include(err.message, 'VM Exception while processing transaction', message));

module.exports = {
  startContract,
  startContractAndRaiseDispute,
  verifyEvent,
  assertError,
  getMinimumContractAmt,
  getPercentageSplit,
  PartyStruct,
  BrehonStruct
}
