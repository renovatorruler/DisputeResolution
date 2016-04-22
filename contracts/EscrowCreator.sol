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

    function EscrowCreator() {
    }

    function initiateCreation(address buyerAddress, address sellerAddress, uint amount) returns (bytes32 token) {
        token = sha256(buyerAddress, sellerAddress, amount);
        Entity memory buyer = Entity(buyerAddress, false);
        Entity memory seller = Entity(sellerAddress, true);
        contracts[token] = EscrowInfo(buyer, seller, amount);
    }

}
