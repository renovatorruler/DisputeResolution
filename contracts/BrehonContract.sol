pragma solidity ^0.4.2;

import "./priced.sol";
import "./stateMachine.sol";
import "./accessRestricted.sol";

/// @title Brehon Contract
contract BrehonContract is
    priced,
    stateMachine,
    accessRestricted {
  struct Party {
    address addr;
    uint deposit;
    bool contractAccepted;
    bool primaryBrehonApproval;
    bool secondaryBrehonApproval;
    bool tertiaryBrehonApproval;
  }

  struct Brehon {
    address addr;
    bool contractAccepted;
    uint fixedFee;
    uint disputeFee;
  }

  uint transactionAmount;
  Party partyA;
  Party partyB;
  Brehon primaryBrehon;
  Brehon secondaryBrehon;
  Brehon tertiaryBrehon;
  Brehon activeBrehon;

  event ExecutionStarted(address _partyA, address _partyB, uint _totalDeposits);

  modifier eitherByParty(Party _party1, Party _party2)
  {
      if (msg.sender != _party1.addr ||
          msg.sender != _party2.addr)
          throw;
      _;

  }

  modifier eitherByBrehon(Brehon _brehon1, Brehon _brehon2, Brehon _brehon3)
  {
      if (msg.sender != _brehon1.addr ||
          msg.sender != _brehon2.addr ||
          msg.sender != _brehon3.addr)
          throw;
      _;

  }

  modifier onlyByActiveBrehon() {
      if (msg.sender != activeBrehon.addr)
          throw;
      _;
  }

  function BrehonContract(
      address _partyA,
      address _partyB,
      uint _transactionAmount,
      address _primaryBrehon,
      uint _primaryBrehonFixedFee,
      uint _primaryBrehonDisputeFee,
      address _secondaryBrehon,
      uint _secondaryBrehonFixedFee,
      uint _secondaryBrehonDisputeFee,
      address _tertiaryBrehon,
      uint _tertiaryBrehonFixedFee,
      uint _tertiaryBrehonDisputeFee
  ) {
    partyA.addr = _partyA;
    transactionAmount = _transactionAmount;

    partyB.addr = _partyB;

    primaryBrehon.addr = _primaryBrehon;
    primaryBrehon.fixedFee = _primaryBrehonFixedFee;
    primaryBrehon.disputeFee = _primaryBrehonDisputeFee;

    secondaryBrehon.addr = _secondaryBrehon;
    secondaryBrehon.fixedFee = _secondaryBrehonFixedFee;
    secondaryBrehon.disputeFee = _secondaryBrehonDisputeFee;

    tertiaryBrehon.addr = _tertiaryBrehon;
    tertiaryBrehon.fixedFee = _tertiaryBrehonFixedFee;
    tertiaryBrehon.disputeFee = _tertiaryBrehonDisputeFee;

    //Defaults
    stage = Stages.Negotiation;
    partyA.contractAccepted = false;
    partyA.primaryBrehonApproval = false;
    partyA.secondaryBrehonApproval = false;
    partyA.tertiaryBrehonApproval = false;
    partyA.deposit = 0;

    partyB.contractAccepted = false;
    partyB.primaryBrehonApproval = false;
    partyB.secondaryBrehonApproval = false;
    partyB.tertiaryBrehonApproval = false;
    partyB.deposit = 0;

    primaryBrehon.contractAccepted = false;
    secondaryBrehon.contractAccepted = false;
    tertiaryBrehon.contractAccepted = false;
  }

  function acceptContract()
    atStage(Stages.Negotiation)
    eitherByParty(partyA, partyB)
    eitherByBrehon(primaryBrehon, secondaryBrehon, tertiaryBrehon)
  {
      if (msg.sender == partyA.addr) {
          partyA.contractAccepted = true;
      } else if (msg.sender == partyB.addr) {
          partyB.contractAccepted = true;
      } else if(msg.sender == primaryBrehon.addr) {
          primaryBrehon.contractAccepted = true;
      } else if(msg.sender == secondaryBrehon.addr) {
          secondaryBrehon.contractAccepted = true;
      } else if(msg.sender == tertiaryBrehon.addr) {
          tertiaryBrehon.contractAccepted = true;
      } else throw;
  }

  function deposit()
    payable
    eitherByParty(partyA, partyB)
  {
      if(msg.sender == partyA.addr) {
          partyA.deposit += msg.value;
      } else if (msg.sender == partyB.addr) {
          partyB.deposit += msg.value;
      } else throw;
  }

  function startContract() {
      if ((partyA.deposit + partyB.deposit) >
          (primaryBrehon.fixedFee + primaryBrehon.disputeFee +
          secondaryBrehon.fixedFee + secondaryBrehon.disputeFee +
          tertiaryBrehon.fixedFee + tertiaryBrehon.disputeFee) +
          transactionAmount
         ) {
             ExecutionStarted(partyA.addr, partyB.addr, partyA.deposit + partyB.deposit);
      }
  }

  function raiseDispute() {
  }

  function getActiveBrehon() {
  }

  function arbitrate() onlyByActiveBrehon() {
  }

  function claimFunds() {
  }

  function raiseAppeal() {
  }

  function raise2ndAppeal() {
  }

  function proposeSettlement() {
  }

  function acceptSettlement() {
  }
}
