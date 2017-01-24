pragma solidity ^0.4.2;

import "./owned.sol";
import "./priced.sol";
import "./stateMachine.sol";
import "./accessRestricted.sol";

/// @title Arbitrated Contract
contract BrehonContract is priced, owned, stateMachine {
  address partyA;
  address partyB;
  address primaryBrehon;
  address secondaryBrehon;
  address tertiaryBrehon;
}
