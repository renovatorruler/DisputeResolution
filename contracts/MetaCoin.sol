import "arbitrated.sol";

contract MetaCoin is arbitrated {
    mapping (address => uint) balances;

    function MetaCoin() {
        balances[tx.origin] = 10000;
    }

    function sendCoin(address receiver, uint amount) disputeLockable returns(bool sufficient) {
        if (balances[msg.sender] < amount) return false;
        balances[msg.sender] -= amount;
        balances[receiver] += amount;
        return true;
    }

    function getBalance(address addr) returns(uint) {
        return balances[addr];
    }
}
