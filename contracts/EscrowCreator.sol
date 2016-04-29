contract EscrowCreator {
    struct Entity {
        address addr;
        bool signed;
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
        Entity memory seller = Entity(sellerAddress, false);
        contracts[token] = EscrowInfo(buyer, seller, amount);
    }

    function getEscrowInfo(bytes32 token) returns (
        address buyerAddr,
        bool buyerSigned,
        address sellerAddr,
        bool sellerSigned,
        uint amount
    ) {
        if(contracts[token].amount == 0) {
            throw;
        }

        buyerAddr = contracts[token].buyer.addr;
        buyerSigned = contracts[token].buyer.signed;
        sellerAddr = contracts[token].seller.addr;
        sellerSigned = contracts[token].seller.signed;
        amount = contracts[token].amount;
    }
}
