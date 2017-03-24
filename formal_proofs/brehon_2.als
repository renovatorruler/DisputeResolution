abstract sig Entity {
}

sig Party, Brehon extends Entity { }

sig Contract {
	partyA: one Party,
	partyB: one Party,
	primaryBrehon: one Brehon,
	secondaryBrehon: one Brehon,
	tertiaryBrehon: one Brehon,
	accepted: set Entity
}{
	partyA != partyB
	primaryBrehon != secondaryBrehon
  secondaryBrehon != tertiaryBrehon
	tertiaryBrehon != primaryBrehon
}


pred signContract (c, c': Contract, e:Entity) {
	e in (partyA, partyB, primaryBrehon)
	c'.accepted = c.accepted + e
}

run signContract for 8 but 1 Contract

//sig PartyA, PartyB, PrimaryBrehon, secondaryBrehon, tertiaryBrehon { }
