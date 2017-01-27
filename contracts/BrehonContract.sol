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
  address primaryBrehon;
  address secondaryBrehon;
  address tertiaryBrehon;
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

  function nominatePrimaryBrehon(address _primaryBrehon)
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
    primaryBrehon = _primaryBrehon;
  }

  function assignSecondaryBrehon(address _secondaryBrehon)
    atStage(Stages.Negotiation)
  {
    secondaryBrehon = _secondaryBrehon;
  }

  function assignTertiaryBrehon(address _tertiaryBrehon)
    atStage(Stages.Negotiation)
  {
    tertiaryBrehon = _tertiaryBrehon;
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
