const R = require('ramda');
const commander = require('commander');

const BrehonContract = artifacts.require('./BrehonContract.sol');
const defaults = require('../config/deployment_settings.js').defaults;
const contractHelpers = require('../lib/contractHelpers.js');

const startContract = contractHelpers.startContract;
const getMinimumContractAmt = contractHelpers.getMinimumContractAmt;
const getSplitForPrimaryBrehon = contractHelpers.getPercentageSplit(defaults, 0);

function info(message, instance) {
  console.log(message);
  return instance;
}

module.exports = function (cb) {
  function startRun(callback) {
    return BrehonContract.deployed()
      .then(info('Starting the contract'))
      .then(startContract([{
        addr: defaults.partyA_addr,
        value: getMinimumContractAmt(defaults),
      }])(defaults.partyA_addr))
      .then(callback());
  }

  function nonDisputeRun(callback) {
    console.info('Running the non-dispute scenario');
    // perform actions
    const settlement = {
      partyA: getSplitForPrimaryBrehon(50),
      partyB: getSplitForPrimaryBrehon(50),
    };

    let brehonContract;
    return BrehonContract.deployed()
      .then(function captureReference(instance) {
        brehonContract = instance;
        return instance;
      })
      .then(info('Starting the contract'))
      .then(startContract([{
        addr: defaults.partyA_addr,
        value: getMinimumContractAmt(defaults),
      }])(defaults.partyA_addr))
      .then(info('Proposing a settlement'))
      .then(function proposeSettlement() {
        return brehonContract.proposeSettlement(
          settlement.partyA,
          settlement.partyB,
          { from: defaults.partyA_addr });
      })
      .then(info('Accepting the settlement'))
      .then(function acceptSettlement() {
        return brehonContract.acceptSettlement(
          settlement.partyA,
          settlement.partyB,
          { from: defaults.partyB_addr });
      })
      .then(callback());
  }

  function init(program, callback) {
    program
      .version('0.0.1')
      .option('-n --non-dispute', 'Start the contract, and do a non-dispute run')
      .option('-s --start-contract', 'Start the contract')
      .parse(process.argv);
    if (program.nonDispute) {
      nonDisputeRun(callback);
    }
    if (program.startContract) {
      startRun(callback);
    }
  }

  return init(commander, cb);
};
