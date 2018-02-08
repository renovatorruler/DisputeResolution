pragma solidity ^0.4.18;

contract priced {
  // Modifiers can receive arguments:
  modifier costs(uint price) {
    if (msg.value >= price) {
      _;
    }
  }
}

