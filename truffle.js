var HDWalletProvider = require("truffle-hdwallet-provider");

let mnemonic = 'myth like bonus scare over problem client lizard pioneer submit female collect';

module.exports = {
  build: 'webpack',
  networks: {
    development: {
      host: 'localhost',
      port: 8545,
      network_id: '*', // Match any network id
    },
    ropsten: {
      provider: new HDWalletProvider(mnemonic, "https://ropsten.infura.io/"),
      network_id: 3,
      gas: 4700036,
    },
  },
};
