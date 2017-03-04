const sha3 = require('solidity-sha3').default;

exports.defaults = {
  partyA_addr: '0x90f8bf6a479f320ead074411a4b0e7944ea8c9c1',
  partyB_addr: '0xffcf8fdee72ac11b5c542428b35eef5769c409f0',
  transactionAmount: '5000',
  contractTermsHash: sha3('Brehon Contract'),
  primaryBrehon_addr: '0x22d491bde2303f2f43325b2108d26f1eaba1e32b',
  primaryBrehon_fixedFee: '10',
  primaryBrehon_disputeFee: '100',
  secondaryBrehon_addr: '0xe11ba2b4d45eaed5996cd0823791e0c93114882d',
  secondaryBrehon_fixedFee: '10',
  secondaryBrehon_disputeFee: '100',
  tertiaryBrehon_addr: '0xd03ea8624c8c5987235048901fb614fdca89b117',
  tertiaryBrehon_fixedFee: '10',
  tertiaryBrehon_disputeFee: '100',
};
