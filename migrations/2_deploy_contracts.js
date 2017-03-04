const BrehonContract = artifacts.require('./BrehonContract.sol');
const defaults = require('../config/deployment_settings.js').defaults;

module.exports = (deployer) => {
  deployer.deploy(BrehonContract,
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
    defaults.tertiaryBrehon_disputeFee);
};
