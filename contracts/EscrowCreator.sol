contract EscrowCreator {
    struct Entity {
        address addr;
        bool accepted;
    }

    struct EscrowInfo {
        Entity buyer;
        Entity seller;
        uint amount;
    }


    mapping (bytes32 => EscrowInfo) contracts;

    function keyGenerator(address buyerAddress, address sellerAddress, uint amount, uint blockNumber) returns (bytes32) {
      return sha3(buyerAddress, sellerAddress, amount, blockNumber);
    }

    function initiateCreation(address buyerAddress, address sellerAddress, uint amount) {
        bytes32 token = keyGenerator(buyerAddress, sellerAddress, amount, block.number);
        Entity memory buyer = Entity(buyerAddress, false);
        Entity memory seller = Entity(sellerAddress, true);
        contracts[token] = EscrowInfo(buyer, seller, amount);
    }

    function getEscrowInfo(bytes32 token) returns (
        address buyerAddr,
        bool buyerAccepted,
        address sellerAddr,
        bool sellerAccepted,
        uint amount
    ) {
        buyerAddr = contracts[token].buyer.addr;
        buyerAccepted = contracts[token].buyer.accepted;
        sellerAddr = contracts[token].seller.addr;
        sellerAccepted = contracts[token].seller.accepted;
        amount = contracts[token].amount;
    }
}
