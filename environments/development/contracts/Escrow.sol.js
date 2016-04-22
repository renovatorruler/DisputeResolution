// Factory "morphs" into a Pudding class.
// The reasoning is that calling load in each context
// is cumbersome.

(function() {

  var contract_data = {
    abi: [{"constant":false,"inputs":[],"name":"release","outputs":[],"type":"function"},{"constant":true,"inputs":[],"name":"amount","outputs":[{"name":"","type":"uint256"}],"type":"function"},{"constant":false,"inputs":[],"name":"void","outputs":[],"type":"function"},{"inputs":[{"name":"buyer","type":"address"},{"name":"seller","type":"address"},{"name":"amount","type":"uint256"}],"type":"constructor"}],
    binary: "606060405260405160608060d78339505060c060405260b68060216000396000f3606060405260e060020a600035046386d1a69f8114602e578063aa8c217c146078578063ac4c25b2146080575b005b602c600054600160a060020a0390811633909116141560b257600154600254600160a060020a0390911690600090606082818181858883f150509054600160a060020a0316915050ff5b60a660025481565b602c60015433600160a060020a039081169116141560b057600054600160a060020a0316ff5b6060908152602090f35b565b600256",
    unlinked_binary: "606060405260405160608060d78339505060c060405260b68060216000396000f3606060405260e060020a600035046386d1a69f8114602e578063aa8c217c146078578063ac4c25b2146080575b005b602c600054600160a060020a0390811633909116141560b257600154600254600160a060020a0390911690600090606082818181858883f150509054600160a060020a0316915050ff5b60a660025481565b602c60015433600160a060020a039081169116141560b057600054600160a060020a0316ff5b6060908152602090f35b565b600256",
    address: "0xae0ca237e943603ddd4398393ed4ddcff63312b0",
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
