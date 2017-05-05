pragma solidity ^0.4.8;

import "./priced.sol";
import "./zeppelin/ownership/Ownable.sol";
import "./BrehonContract.sol";

/// @title Brehon Contract Factory
contract BrehonContractFactory is
    priced {

  struct BrehonContractInfo {
      address partyAAddr;
      address partyBAddr;
      uint public transactionAmount;
      bytes32 public contractTermsHash;
      address primaryBrehonAddr;
      uint primaryBrehonFixedFee;
      uint primaryBrehonDepositFee;
      address secondaryBrehonAddr;
      uint secondaryBrehonFixedFee;
      uint secondaryBrehonDepositFee;
      address tertiaryBrehonAddr;
      uint tertiaryBrehonFixedFee;
      uint tertiaryBrehonDepositFee;
  }

  mapping(address => contractCount) contractCounter;
  mapping(bytes20 => BrehonContractInfo) contracts;

  function BrehonContractFactory() {
  }

  function newBrehonContract(
      address _partyA,
      address _partyB,
      uint _transactionAmount,
      bytes32 _contractTermsHash,
      address _primaryBrehon,
      uint _primaryBrehonFixedFee,
      uint _primaryBrehonDisputeFee,
      address _secondaryBrehon,
      uint _secondaryBrehonFixedFee,
      uint _secondaryBrehonDisputeFee,
      address _tertiaryBrehon,
      uint _tertiaryBrehonFixedFee,
      uint _tertiaryBrehonDisputeFee
  ) returns bytes20 hash {
    hash = ripemd160(msg.sender, contractCounter[msg.sender]);
    contractCounter[msg.sender]++;
    contracts[hash] = BrehonContractInfo(
        _partyA,
        _partyB,
        _transactionAmount,
        _contractTermsHash,
        _primaryBrehon,
        _primaryBrehonFixedFee,
        _primaryBrehonDisputeFee,
        _secondaryBrehon,
        _secondaryBrehonFixedFee,
        _secondaryBrehonDisputeFee,
        _tertiaryBrehon,
        _tertiaryBrehonFixedFee,
        _tertiaryBrehonDisputeFee
    );
  }

  function setPartyA(address addr) onlyOwner {
    partyA.addr = addr;
  }

  function setPartyB(address addr) onlyOwner {
    partyB.addr = addr;
  }

  function setPrimaryBrehon(address addr, uint fixedFee, uint depositFee) onlyOwner {
    primaryBrehon.addr = addr;
    primaryBrehon.fixedFee = fixedFee;
    primaryBrehon.depositFee = depositFee;
  }

  function setSecondaryBrehon(address addr, uint fixedFee, uint depositFee) onlyOwner {
    secondaryBrehon.addr = addr;
    secondaryBrehon.fixedFee = fixedFee;
    secondaryBrehon.depositFee = depositFee;
  }

  function setTertiaryBrehon(address addr, uint fixedFee, uint depositFee) onlyOwner {
    tertiaryBrehon.addr = addr;
    tertiaryBrehon.fixedFee = fixedFee;
    tertiaryBrehon.depositFee = depositFee;
  }

  function setTransactionAmount(uint _transactionAmount) {
    transactionAmount = _transactionAmount;
  }

  function setContractTermsHash(bytes32 _contractTermsHash) {
    contractTermsHash = _contractTermsHash;
  }

  function deployContract() onlyOwner {
  }
}
