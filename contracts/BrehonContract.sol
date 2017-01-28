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
    bool primaryBrehonApproval;
    bool secondaryBrehonApproval;
    bool tertiaryBrehonApproval;
  }

  struct Brehon {
    address addr;
    uint fixedFee;
    uint disputeFee;
  }

  uint transactionAmount;
  Party partyA;
  Party partyB;
  Brehon primaryBrehon;
  Brehon secondaryBrehon;
  Brehon tertiaryBrehon;

  modifier eitherByParty(Party _party1, Party _party2)
  {
      if (msg.sender != _party1.addr ||
          msg.sender != _party2.addr)
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
    partyA.primaryBrehonApproval = false;
    partyA.secondaryBrehonApproval = false;
    partyA.tertiaryBrehonApproval = false;

    transactionAmount = _transactionAmount;

    partyB.addr = _partyB;
    partyB.primaryBrehonApproval = false;
    partyB.secondaryBrehonApproval = false;
    partyB.tertiaryBrehonApproval = false;

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
  }

  function acceptContract()
    atStage(Stages.Negotiation)
    eitherByParty(partyA, partyB, primaryBrehon, secondaryBrehon, tertiaryBrehon)
  {
      if (msg.sender == partyA.addr) {
          partyA.primaryBrehonApproval = true;
      } else if (msg.sender == partyB.addr) {
          partyA.primaryBrehonApproval = true;
      }
  }

  function nominatePrimaryBrehon(address _primaryBrehon, uint _fixedFee, uint _disputeFee)
    atStage(Stages.Negotiation)
    eitherByParty(partyA, partyB)
  {
    if(msg.sender == partyA.addr &&
      !partyA.primaryBrehonApproval) {
      partyA.primaryBrehonApproval = true;
    }
    if(msg.sender == partyB.addr &&
      !partyB.primaryBrehonApproval) {
      partyB.primaryBrehonApproval = true;
    }
    primaryBrehon.addr = _primaryBrehon;
    primaryBrehon.fixedFee = _fixedFee;
    primaryBrehon.disputeFee = _disputeFee;
  }

  function assignSecondaryBrehon(address _secondaryBrehon, uint _fixedFee, uint _disputeFee)
    atStage(Stages.Negotiation)
  {
    secondaryBrehon.addr = _secondaryBrehon;
    secondaryBrehon.fixedFee = _fixedFee;
    secondaryBrehon.disputeFee = _disputeFee;
  }

  function assignTertiaryBrehon(address _tertiaryBrehon, uint _fixedFee, uint _disputeFee)
    atStage(Stages.Negotiation)
  {
    tertiaryBrehon.addr = _tertiaryBrehon;
    tertiaryBrehon.fixedFee = _fixedFee;
    tertiaryBrehon.disputeFee = _disputeFee;
  }

  function deposit() {
  }

  function startContract() {
  }

  function raiseDispute() {
  }

  function getActiveBrehon() {
  }

  function arbitrate() {
  }

  function claimFunds() {
  }

  function raiseAppeal() {
  }

  function raise2ndAppeal() {
  }
}
