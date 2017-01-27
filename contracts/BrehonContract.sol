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

  Party partyA;
  Party partyB;
  Brehon primaryBrehon;
  Brehon secondaryBrehon;
  Brehon tertiaryBrehon;
  mapping (address => uint) balances;

  function BrehonContract(address _partyA, address _partyB) {
    stage = Stages.Negotiation;
    partyA.addr = _partyA;
    partyB.addr = _partyB;
  }

  function assignPartyA(address _partyA)
    atStage(Stages.Negotiation) 
  {
    partyA.addr = _partyA;
  }

  function assignPartyB(address _partyB)
    atStage(Stages.Negotiation)
  {
    partyB.addr = _partyB;
  }

  function nominatePrimaryBrehon(address _primaryBrehon, uint _fixedFee, uint _disputeFee)
    atStage(Stages.Negotiation)
    eitherBy(partyA.addr, partyB.addr)
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
