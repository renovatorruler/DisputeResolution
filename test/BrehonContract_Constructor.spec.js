const BrehonContract = artifacts.require("./BrehonContract.sol");
const defaults = require('../config/deployment_settings.js').defaults;

const contractHelpers = require('../lib/contractHelpers.js');
const PartyStruct = contractHelpers.PartyStruct;
const BrehonStruct = contractHelpers.BrehonStruct;

contract('BrehonContract constructor', (accounts) => {
  it('should set appealLevel to -1', () => {
    return BrehonContract.deployed().then((instance) => {
      return instance.appealLevel.call().then((appealLevel) => {
        assert.equal(appealLevel.valueOf(), -1);
      });
    });
  });

  it('should set transactionAmount to ' + defaults.transactionAmount, () => {
    return BrehonContract.deployed().then((instance) => {
      return instance.transactionAmount.call().then((transactionAmount) => {
        assert.equal(transactionAmount.valueOf(), defaults.transactionAmount);
      });
    });
  });

  it('should set the stage to Negotiation', () => {
    return BrehonContract.deployed().then((instance) => {
      return instance.stage.call().then((stage) => {
        assert.equal(stage.valueOf(), 0);
      });
    });
  });

  it("should set partyA's address properly", () => {
    return BrehonContract.deployed().then((brehonContract) => {
      return brehonContract.partyA.call().then((partyA) => {
        assert.equal(partyA[PartyStruct.addr], defaults.partyA_addr);
      });
    });
  });

  it("should set partyA's deposit to 0", () => {
    return BrehonContract.deployed().then((brehonContract) => {
      return brehonContract.partyA.call().then((partyA) => {
        assert.equal(partyA[PartyStruct.deposit].valueOf(), 0);
      });
    });
  });

  it("should set partyA's contractAccepted to false", () => {
    return BrehonContract.deployed().then((brehonContract) => {
      return brehonContract.partyA.call().then((partyA) => {
        assert.equal(partyA[PartyStruct.contractAccepted], false);
      });
    });
  });

  it("should set partyA's primaryBrehonApproval to false", () => {
    return BrehonContract.deployed().then((brehonContract) => {
      return brehonContract.partyA.call().then((partyA) => {
        assert.equal(partyA[PartyStruct.primaryBrehonApproval], false);
      });
    });
  });

  it("should set partyA's secondaryBrehonApproval to false", () => {
    return BrehonContract.deployed().then((brehonContract) => {
      return brehonContract.partyA.call().then((partyA) => {
        assert.equal(partyA[PartyStruct.secondaryBrehonApproval], false);
      });
    });
  });

  it("should set partyA's tertiaryBrehonApproval to false", () => {
    return BrehonContract.deployed().then((brehonContract) => {
      return brehonContract.partyA.call().then((partyA) => {
        assert.equal(partyA[PartyStruct.tertiaryBrehonApproval], false);
      });
    });
  });

  it("should set partyB's address properly", () => {
    return BrehonContract.deployed().then((brehonContract) => {
      return brehonContract.partyB.call().then((partyB) => {
        assert.equal(partyB[PartyStruct.addr], defaults.partyB_addr);
      });
    });
  });

  it("should set partyB's deposit to 0", () => {
    return BrehonContract.deployed().then((brehonContract) => {
      return brehonContract.partyB.call().then((partyB) => {
        assert.equal(partyB[PartyStruct.deposit].valueOf(), 0);
      });
    });
  });

  it("should set partyB's contractAccepted to false", () => {
    return BrehonContract.deployed().then((brehonContract) => {
      return brehonContract.partyB.call().then((partyB) => {
        assert.equal(partyB[PartyStruct.contractAccepted], false);
      });
    });
  });

  it("should set partyB's primaryBrehonApproval to false", () => {
    return BrehonContract.deployed().then((brehonContract) => {
      return brehonContract.partyB.call().then((partyB) => {
        assert.equal(partyB[PartyStruct.primaryBrehonApproval], false);
      });
    });
  });

  it("should set partyB's secondaryBrehonApproval to false", () => {
    return BrehonContract.deployed().then((brehonContract) => {
      return brehonContract.partyB.call().then((partyB) => {
        assert.equal(partyB[PartyStruct.secondaryBrehonApproval], false);
      });
    });
  });

  it("should set partyB's tertiaryBrehonApproval to false", () => {
    return BrehonContract.deployed().then((brehonContract) => {
      return brehonContract.partyB.call().then((partyB) => {
        assert.equal(partyB[PartyStruct.tertiaryBrehonApproval], false);
      });
    });
  });

  it("should set primaryBrehon's address properly", () => {
    return BrehonContract.deployed().then((brehonContract) => {
      return brehonContract.primaryBrehon.call().then((primaryBrehon) => {
        assert.equal(primaryBrehon[BrehonStruct.addr], defaults.primaryBrehon_addr);
      });
    });
  });

  it("should set primaryBrehon's contractAcceptance to false", () => {
    return BrehonContract.deployed().then((brehonContract) => {
      return brehonContract.primaryBrehon.call().then((primaryBrehon) => {
        assert.equal(primaryBrehon[BrehonStruct.contractAccepted], false);
      });
    });
  });

  it("should set primaryBrehon's fixedFee properly", () => {
    return BrehonContract.deployed().then((brehonContract) => {
      return brehonContract.primaryBrehon.call().then((primaryBrehon) => {
        assert.equal(primaryBrehon[BrehonStruct.fixedFee].valueOf(), defaults.primaryBrehon_fixedFee);
      });
    });
  });

  it("should set primaryBrehon's disputeFee properly", () => {
    return BrehonContract.deployed().then((brehonContract) => {
      return brehonContract.primaryBrehon.call().then((primaryBrehon) => {
        assert.equal(primaryBrehon[BrehonStruct.disputeFee].valueOf(), defaults.primaryBrehon_disputeFee);
      });
    });
  });

  it("should set secondaryBrehon's address properly", () => {
    return BrehonContract.deployed().then((brehonContract) => {
      return brehonContract.secondaryBrehon.call().then((secondaryBrehon) => {
        assert.equal(secondaryBrehon[BrehonStruct.addr], defaults.secondaryBrehon_addr);
      });
    });
  });

  it("should set secondaryBrehon's contractAcceptance to false", () => {
    return BrehonContract.deployed().then((brehonContract) => {
      return brehonContract.secondaryBrehon.call().then((secondaryBrehon) => {
        assert.equal(secondaryBrehon[BrehonStruct.contractAccepted], false);
      });
    });
  });

  it("should set secondaryBrehon's fixedFee properly", () => {
    return BrehonContract.deployed().then((brehonContract) => {
      return brehonContract.secondaryBrehon.call().then((secondaryBrehon) => {
        assert.equal(secondaryBrehon[BrehonStruct.fixedFee].valueOf(), defaults.secondaryBrehon_fixedFee);
      });
    });
  });

  it("should set secondaryBrehon's disputeFee properly", () => {
    return BrehonContract.deployed().then((brehonContract) => {
      return brehonContract.secondaryBrehon.call().then((secondaryBrehon) => {
        assert.equal(secondaryBrehon[BrehonStruct.disputeFee].valueOf(), defaults.secondaryBrehon_disputeFee);
      });
    });
  });

  it("should set tertiaryBrehon's address properly", () => {
    return BrehonContract.deployed().then((brehonContract) => {
      return brehonContract.tertiaryBrehon.call().then((tertiaryBrehon) => {
        assert.equal(tertiaryBrehon[BrehonStruct.addr], defaults.tertiaryBrehon_addr);
      });
    });
  });

  it("should set tertiaryBrehon's contractAcceptance to false", () => {
    return BrehonContract.deployed().then((brehonContract) => {
      return brehonContract.tertiaryBrehon.call().then((tertiaryBrehon) => {
        assert.equal(tertiaryBrehon[BrehonStruct.contractAccepted], false);
      });
    });
  });

  it("should set tertiaryBrehon's fixedFee to " + defaults.tertiaryBrehon_fixedFee, () => {
    return BrehonContract.deployed().then((brehonContract) => {
      return brehonContract.tertiaryBrehon.call().then((tertiaryBrehon) => {
        assert.equal(tertiaryBrehon[BrehonStruct.fixedFee].valueOf(), defaults.tertiaryBrehon_fixedFee);
      });
    });
  });

  it("should set tertiaryBrehon's disputeFee properly", () => {
    return BrehonContract.deployed().then((brehonContract) => {
      return brehonContract.tertiaryBrehon.call().then((tertiaryBrehon) => {
        assert.equal(tertiaryBrehon[BrehonStruct.disputeFee].valueOf(), defaults.tertiaryBrehon_disputeFee);
      });
    });
  });
});
