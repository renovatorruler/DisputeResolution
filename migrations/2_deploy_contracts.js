//var ConvertLib = artifacts.require("./ConvertLib.sol");
//var MetaCoin = artifacts.require("./MetaCoin.sol");
var BrehonContract = artifacts.require("./BrehonContract.sol");
var defaults = require('../config/deployment_settings.js').defaults;

module.exports = function(deployer) {
  deployer.deploy(BrehonContract,
    defaults.partyA_addr,
    defaults.partyB_addr,
    defaults.transactionAmount,
    defaults.primaryBrehon_addr,
    defaults.primaryBrehon_fixedFee,
    defaults.primaryBrehon_disputeFee,
    defaults.secondaryBrehon_addr,
    defaults.secondaryBrehon_fixedFee,
    defaults.secondaryBrehon_disputeFee,
    defaults.tertiaryBrehon_addr,
    defaults.tertiaryBrehon_fixedFee,
    defaults.tertiaryBrehon_disputeFee
  );
};
