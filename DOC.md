Contract Brehon {
  address partyA
  address partyB
  address primaryBrehon
  address secondaryBrehon
  address tertiaryBrehon

  states = [
    NEGOTIATION,
    EXECUTION,
    DISPUTED, 
    RESOLVED,
    APPEALED, 
    COMPLETED
  ]

  Constructor(partyA, partyB, primaryBrehon, secondaryBrehon, tertiaryBrehon);

  setPartyA() 
  setPartyB() 
  setPrimaryBrehon() 
  setSecondaryBrehon()
  setTertiaryBrehon()

  deposit()

  startContract() called by both parties. 
  raiseDispute() called by either parties 

  getActiveBrehon() 
  arbitrate() by the active Brehon 
  claimFunds() by either parties 

  raiseAppeal() by either parties
  raise2ndAppeal()  by either parties

}
