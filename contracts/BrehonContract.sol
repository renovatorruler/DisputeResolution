pragma solidity ^0.4.2;

import "./priced.sol";
import "./stateMachine.sol";
import "./accessRestricted.sol";

/// @title Brehon Contract
contract BrehonContract is
    priced,
    stateMachine,
    accessRestricted {
  address partyA;
  address partyB;
  address primaryBrehon;
  address secondaryBrehon;
  address tertiaryBrehon;
  mapping (address => uint) balances;

  function BrehonContract() {
    stage = Stages.Negotiation;
  }

  function assignPartyA(address _partyA)
    atStage(Stages.Negotiation) 
  {
    partyA = _partyA;
  }

  function assignPartyB(address _partyB)
    atStage(Stages.Negotiation)
  {
    partyB = _partyB;
  }

  function assignPrimaryBrehon(address _primaryBrehon)
    atStage(Stage.Negotiation) 
  {
    primaryBrehon = _primaryBrehon;
  }

  function assignSecondaryBrehon(address _secondaryBrehon)
    atStage(Stage.Negotiation)
  {
    secondaryBrehon = _secondaryBrehon;
  }

  function assignTertiaryBrehon(address _tertiaryBrehon)
    atStage(Stage.Negotiation)
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
