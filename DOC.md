Contract Brehon {
  Party partyA
  Party partyB
  Brehon primaryBrehon
  Brehon secondaryBrehon
  Brehon tertiaryBrehon

  states = [
    Negotiation,
    Execution,
    Disputed,
    Resolved,
    Appealed,
    Completed
  ]

  Constructor(partyA, partyB, primaryBrehon, secondaryBrehon, tertiaryBrehon);

  setPartyA() atStage(Negotiation)
  acceptPartyA() atStage(Negotiation) 
  setPartyB() atStage(Negotiation)
  acceptPartyB() atStage(Negotiation)

  nominatePrimaryBrehon() atStage(Negotiation)
  acceptPrimaryBrehon() atStage(Negotiation)

  nominateSecondaryBrehon() atStage(Negotiation)
  acceptSecondaryBrehon() atStage(Negotiation)

  nominateTertiaryBrehon() atStage(Negotiation)
  acceptTertiaryBrehon() atStage(Negotiation)

  deposit() atStage(Negotiation)

  startContract() called by both parties. 
  raiseDispute() called by either parties 

  getActiveBrehon() 
  arbitrate() by the active Brehon 
  claimFunds() by either parties 

  raiseAppeal() by either parties
  raise2ndAppeal()  by either parties

}
