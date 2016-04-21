contract Escrow {
    address buyer;
    address seller;
    uint public amount;

    function EscrowRaj() {
        //aka setBuyer
        buyer = msg.sender;
    }

    function setSeller(address sellerAddress) {
        seller = sellerAddress;
    }

    function setAmount(uint amt) {
        amount = amt;
    }

    function release() {
        //Only allow buyer to release the funds
        if (msg.sender == buyer) {
            seller.send(amount);
            suicide(buyer);
        } else {
            throw;
        }
    }

    function void() {
        //Only allow seller to void the contract
        if (msg.sender == seller) {
            suicide(buyer);
        }
    }
}
