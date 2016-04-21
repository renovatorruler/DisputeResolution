// Factory "morphs" into a Pudding class.
// The reasoning is that calling load in each context
// is cumbersome.

(function() {

  var contract_data = {
    abi: [{"constant":false,"inputs":[],"name":"release","outputs":[],"type":"function"},{"constant":false,"inputs":[],"name":"void","outputs":[],"type":"function"},{"constant":false,"inputs":[{"name":"sellerAddress","type":"address"},{"name":"amt","type":"uint256"}],"name":"setSellerAndAmt","outputs":[],"type":"function"},{"constant":false,"inputs":[],"name":"EscrowRaj","outputs":[],"type":"function"}],
    binary: "6060604052610110806100126000396000f3606060405260e060020a600035046386d1a69f811461003c578063ac4c25b214610089578063c4969b8f146100b0578063fbd22407146100e6575b005b61003a600054600160a060020a039081163391909116141561010b57600154600254600160a060020a0390911690600090606082818181858883f150509054600160a060020a0316915050ff5b61003a600154600160a060020a033381169116141561010957600054600160a060020a0316ff5b61003a6004356024356001805473ffffffffffffffffffffffffffffffffffffffff1916831790553481901061010b5760025550565b61003a6000805473ffffffffffffffffffffffffffffffffffffffff1916331790555b565b61000256",
    unlinked_binary: "6060604052610110806100126000396000f3606060405260e060020a600035046386d1a69f811461003c578063ac4c25b214610089578063c4969b8f146100b0578063fbd22407146100e6575b005b61003a600054600160a060020a039081163391909116141561010b57600154600254600160a060020a0390911690600090606082818181858883f150509054600160a060020a0316915050ff5b61003a600154600160a060020a033381169116141561010957600054600160a060020a0316ff5b61003a6004356024356001805473ffffffffffffffffffffffffffffffffffffffff1916831790553481901061010b5760025550565b61003a6000805473ffffffffffffffffffffffffffffffffffffffff1916331790555b565b61000256",
    address: "0xbd1a06848240aa9796f2ed8ab977e0a727d2bb5c",
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
