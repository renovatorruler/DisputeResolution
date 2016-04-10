contract Escrow {
    address buyer;
    address seller;
    uint amount;

    function EscrowRaj() {
        //aka setBuyer
        buyer = msg.sender;
    }

    function setSellerAndAmt(address sellerAddress, uint amt) {
        seller = sellerAddress;
        if (msg.value >= amt) {
            amount = amt;
        } else {
          throw;
        }
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
