contract Tribitrated {
    function kill (address addr) {
        suicide(addr);
    }
}
