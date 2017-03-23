

abstract sig Entity {
	accepted: lone Contract
}

sig Party, Brehon extends Entity { }

sig Contract {
	partyA: one Party,
	partyB: one Party,
	primaryBrehon: one Brehon,
	secondaryBrehon: one Brehon,
	tertiaryBrehon: one Brehon
}{
	partyA != partyB
	primaryBrehon != secondaryBrehon
  secondaryBrehon != tertiaryBrehon
	tertiaryBrehon != primaryBrehon
}


pred signContract (e, e': Entity, c: Contract) {
	c.partyA = e
	e'.accepted = c
}

run signContract for exactly 1 Contract, 2 Party, 3 Brehon

//sig PartyA, PartyB, PrimaryBrehon, secondaryBrehon, tertiaryBrehon { }
