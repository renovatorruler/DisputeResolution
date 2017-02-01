module.exports = function(deployer) {
  //deployer.deploy(ConvertLib);
  //deployer.autolink();
  deployer.deploy(BrehonContract,
    '0x90f8bf6a479f320ead074411a4b0e7944ea8c9c1', //PartyA
    '0xffcf8fdee72ac11b5c542428b35eef5769c409f0', //PartyB
    10000000000000000000, //transactionAmount
    '0x22d491bde2303f2f43325b2108d26f1eaba1e32b', //PrimaryBrehon
    100000000000000000, //PrimaryBrehon Fixed Fee
    1000000000000000000, //PrimaryBrehon Dispute Fee
    '0xe11ba2b4d45eaed5996cd0823791e0c93114882d', //SecondaryBrehon
    100000000000000000, //SecondaryBrehon Fixed Fee
    1000000000000000000, //SecondaryBrehon Dispute Fee
    '0xd03ea8624c8c5987235048901fb614fdca89b117', //TertiaryBrehon
    100000000000000000, //TertiaryBrehon Fixed Fee
    1000000000000000000, //TertiaryBrehon Dispute Fee
  );
};
