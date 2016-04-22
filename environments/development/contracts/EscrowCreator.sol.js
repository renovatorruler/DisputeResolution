// Factory "morphs" into a Pudding class.
// The reasoning is that calling load in each context
// is cumbersome.

(function() {

  var contract_data = {
    abi: [{"constant":false,"inputs":[{"name":"buyerAddress","type":"address"},{"name":"sellerAddress","type":"address"},{"name":"amount","type":"uint256"}],"name":"initiateCreation","outputs":[{"name":"token","type":"bytes32"}],"type":"function"},{"inputs":[],"type":"constructor"}],
    binary: "606060405261017c806100126000396000f3606060405260e060020a600035046356b89473811461001b575b005b61016660043560243560443560006060818152608082905260e0604081905260a083815260c08490526c0100000000000000000000000073ffffffffffffffffffffffffffffffffffffffff8089168202845287160260f452610108859052906002906101289060209060488188866161da5a03f11561000257506040805180518183018352988152602081810187905282518084018452988952600189820181905283519687018452918652858101988952858301978852898752868152919095209351805185549183015173ffffffffffffffffffffffffffffffffffffffff1992831690911774ff00000000000000000000000000000000000000001990811674010000000000000000000000000000000000000000928302178755985180519787018054919094015192169096179097169690940295909517909255915191909201555090565b6040518082815260200191505060405180910390f3",
    unlinked_binary: "606060405261017c806100126000396000f3606060405260e060020a600035046356b89473811461001b575b005b61016660043560243560443560006060818152608082905260e0604081905260a083815260c08490526c0100000000000000000000000073ffffffffffffffffffffffffffffffffffffffff8089168202845287160260f452610108859052906002906101289060209060488188866161da5a03f11561000257506040805180518183018352988152602081810187905282518084018452988952600189820181905283519687018452918652858101988952858301978852898752868152919095209351805185549183015173ffffffffffffffffffffffffffffffffffffffff1992831690911774ff00000000000000000000000000000000000000001990811674010000000000000000000000000000000000000000928302178755985180519787018054919094015192169096179097169690940295909517909255915191909201555090565b6040518082815260200191505060405180910390f3",
    address: "0x0724135c9bab5615c33e00726e22deffb990c6b0",
    generated_with: "2.0.6",
    contract_name: "EscrowCreator"
  };

  function Contract() {
    if (Contract.Pudding == null) {
      throw new Error("EscrowCreator error: Please call load() first before creating new instance of this contract.");
    }

    Contract.Pudding.apply(this, arguments);
  };

  Contract.load = function(Pudding) {
    Contract.Pudding = Pudding;

    Pudding.whisk(contract_data, Contract);

    // Return itself for backwards compatibility.
    return Contract;
  }

  Contract.new = function() {
    if (Contract.Pudding == null) {
      throw new Error("EscrowCreator error: Please call load() first before calling new().");
    }

    return Contract.Pudding.new.apply(Contract, arguments);
  };

  Contract.at = function() {
    if (Contract.Pudding == null) {
      throw new Error("EscrowCreator error: lease call load() first before calling at().");
    }

    return Contract.Pudding.at.apply(Contract, arguments);
  };

  Contract.deployed = function() {
    if (Contract.Pudding == null) {
      throw new Error("EscrowCreator error: Please call load() first before calling deployed().");
    }

    return Contract.Pudding.deployed.apply(Contract, arguments);
  };

  if (typeof module != "undefined" && typeof module.exports != "undefined") {
    module.exports = Contract;
  } else {
    // There will only be one version of Pudding in the browser,
    // and we can use that.
    window.EscrowCreator = Contract;
  }

})();
