contract Escrow {
    address buyer;
    address seller;
    uint public amount;

    function Escrow(address buyer, address seller, uint amount) {
        buyer = buyer;
        seller = seller;
        amount = amount;
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
