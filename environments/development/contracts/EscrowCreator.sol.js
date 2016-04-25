// Factory "morphs" into a Pudding class.
// The reasoning is that calling load in each context
// is cumbersome.

(function() {

  var contract_data = {
    abi: [{"constant":false,"inputs":[{"name":"buyerAddress","type":"address"},{"name":"sellerAddress","type":"address"},{"name":"amount","type":"uint256"},{"name":"blockNumber","type":"uint256"}],"name":"keyGenerator","outputs":[{"name":"","type":"bytes32"}],"type":"function"},{"constant":false,"inputs":[{"name":"buyerAddress","type":"address"},{"name":"sellerAddress","type":"address"},{"name":"amount","type":"uint256"}],"name":"initiateCreation","outputs":[],"type":"function"},{"constant":false,"inputs":[{"name":"token","type":"bytes32"}],"name":"getEscrowInfo","outputs":[{"name":"buyerAddr","type":"address"},{"name":"buyerAccepted","type":"bool"},{"name":"sellerAddr","type":"address"},{"name":"sellerAccepted","type":"bool"},{"name":"amount","type":"uint256"}],"type":"function"}],
    binary: "606060405261021b806100126000396000f3606060405260e060020a6000350463191fdd7d811461003157806356b89473146100965780639585e82d146100d5575b005b6101486004356024356044356064355b6040805173ffffffffffffffffffffffffffffffffffffffff9586166c010000000000000000000000009081028252949095169093026014850152602884019190915260488301525190819003606801902090565b61002f60043560243560443560408051808201825260008082526020828101829052835180850190945281845283018190529161015a86868643610041565b6004356000908152602081815260409182902080546001820154600290920154845173ffffffffffffffffffffffffffffffffffffffff808416825260ff60a060020a94859004811696830196909652841681870152919092049092166060830152608082015290519081900360a00190f35b60408051918252519081900360200190f35b6040805180820182529788526000602089810182905282518084018452988952600189820181905283516060810185529a8b528a8201998a528a84019889529382528181529190208054985180519083015173ffffffffffffffffffffffffffffffffffffffff199a8b169190911774ff00000000000000000000000000000000000000001990811660a060020a92830217835593820180549951805194015199909a1692909217909216960295909517909555505051600291909101555056",
    unlinked_binary: "606060405261021b806100126000396000f3606060405260e060020a6000350463191fdd7d811461003157806356b89473146100965780639585e82d146100d5575b005b6101486004356024356044356064355b6040805173ffffffffffffffffffffffffffffffffffffffff9586166c010000000000000000000000009081028252949095169093026014850152602884019190915260488301525190819003606801902090565b61002f60043560243560443560408051808201825260008082526020828101829052835180850190945281845283018190529161015a86868643610041565b6004356000908152602081815260409182902080546001820154600290920154845173ffffffffffffffffffffffffffffffffffffffff808416825260ff60a060020a94859004811696830196909652841681870152919092049092166060830152608082015290519081900360a00190f35b60408051918252519081900360200190f35b6040805180820182529788526000602089810182905282518084018452988952600189820181905283516060810185529a8b528a8201998a528a84019889529382528181529190208054985180519083015173ffffffffffffffffffffffffffffffffffffffff199a8b169190911774ff00000000000000000000000000000000000000001990811660a060020a92830217835593820180549951805194015199909a1692909217909216960295909517909555505051600291909101555056",
    address: "0xa5bd015ba170684cb9dd0a6dbd40d8f761154990",
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
