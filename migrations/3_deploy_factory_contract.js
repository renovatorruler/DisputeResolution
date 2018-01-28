const BrehonContractFactory = artifacts.require('./BrehonContractFactory.sol');

module.exports = (deployer) => {
  deployer.deploy(BrehonContractFactory);
};
