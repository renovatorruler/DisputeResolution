// Factory "morphs" into a Pudding class.
// The reasoning is that calling load in each context
// is cumbersome.

(function() {

  var contract_data = {
    abi: [{"constant":false,"inputs":[{"name":"amt","type":"uint256"}],"name":"setAmount","outputs":[],"type":"function"},{"constant":false,"inputs":[],"name":"release","outputs":[],"type":"function"},{"constant":true,"inputs":[],"name":"amount","outputs":[{"name":"","type":"uint256"}],"type":"function"},{"constant":false,"inputs":[],"name":"void","outputs":[],"type":"function"},{"constant":false,"inputs":[{"name":"sellerAddress","type":"address"}],"name":"setSeller","outputs":[],"type":"function"},{"constant":false,"inputs":[],"name":"EscrowRaj","outputs":[],"type":"function"}],
    binary: "606060405261013a806100126000396000f3606060405236156100565760e060020a6000350463271f88b4811461005857806386d1a69f14610063578063aa8c217c146100b0578063ac4c25b2146100b9578063e99d2866146100e0578063fbd2240714610106575b005b600435600255610056565b610056600054600160a060020a039081163391909116141561013557600154600254600160a060020a0390911690600090606082818181858883f150509054600160a060020a0316915050ff5b61012b60025481565b610056600154600160a060020a033381169116141561012957600054600160a060020a0316ff5b6001805473ffffffffffffffffffffffffffffffffffffffff1916600435179055610056565b6100566000805473ffffffffffffffffffffffffffffffffffffffff1916331790555b565b6060908152602090f35b61000256",
    unlinked_binary: "606060405261013a806100126000396000f3606060405236156100565760e060020a6000350463271f88b4811461005857806386d1a69f14610063578063aa8c217c146100b0578063ac4c25b2146100b9578063e99d2866146100e0578063fbd2240714610106575b005b600435600255610056565b610056600054600160a060020a039081163391909116141561013557600154600254600160a060020a0390911690600090606082818181858883f150509054600160a060020a0316915050ff5b61012b60025481565b610056600154600160a060020a033381169116141561012957600054600160a060020a0316ff5b6001805473ffffffffffffffffffffffffffffffffffffffff1916600435179055610056565b6100566000805473ffffffffffffffffffffffffffffffffffffffff1916331790555b565b6060908152602090f35b61000256",
    address: "0xf7bb97691e0636993f74f09891f100c936da9213",
    generated_with: "2.0.6",
    contract_name: "Escrow"
  };

  function Contract() {
    if (Contract.Pudding == null) {
      throw new Error("Escrow error: Please call load() first before creating new instance of this contract.");
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
      throw new Error("Escrow error: Please call load() first before calling new().");
    }

    return Contract.Pudding.new.apply(Contract, arguments);
  };

  Contract.at = function() {
    if (Contract.Pudding == null) {
      throw new Error("Escrow error: lease call load() first before calling at().");
    }

    return Contract.Pudding.at.apply(Contract, arguments);
  };

  Contract.deployed = function() {
    if (Contract.Pudding == null) {
      throw new Error("Escrow error: Please call load() first before calling deployed().");
    }

    return Contract.Pudding.deployed.apply(Contract, arguments);
  };

  if (typeof module != "undefined" && typeof module.exports != "undefined") {
    module.exports = Contract;
  } else {
    // There will only be one version of Pudding in the browser,
    // and we can use that.
    window.Escrow = Contract;
  }

})();
