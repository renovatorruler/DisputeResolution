sig Party, Brehon { }

sig Contract {
	partyA: one Party,
	partyB: one Party,
	primaryBrehon: one Brehon,
	secondaryBrehon: one Brehon,
	tertiaryBrehon: one Brehon
}

pred raiseDispute { }

run raiseDispute for 2 Contract

//sig PartyA, PartyB, PrimaryBrehon, secondaryBrehon, tertiaryBrehon { }
