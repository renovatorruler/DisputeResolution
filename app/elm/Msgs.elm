module Msgs exposing (..)

import Models
    exposing
        ( Address
        , ContractInfo
        , Settlement
        , Wei
        , PartyModel
        , BrehonModel
        , Parties
        , Brehons
        , Event
        )


type Msg
    = LoadAccounts (List Address)
    | LoadContractInfo ( Address, Int, Wei, Wei )
    | LoadAllParties Parties
    | LoadAllBrehons Brehons
    | AcceptContractByParty PartyModel
    | AcceptContractByBrehon BrehonModel
    | DepositFieldChanged Wei
    | DepositFunds PartyModel
    | SettlementPartyAFieldChanged Wei
    | SettlementPartyBFieldChanged Wei
    | StartContract PartyModel
    | LoadProposedSettlement (Maybe Settlement)
    | ProposeSettlement PartyModel
    | AcceptSettlement PartyModel
    | LoadAllEvents
    | LoadExecutionStartedEvent ( Int, Address, Address, Wei )
    | LoadSettlementProposedEvent ( Int, Address, Address, Wei, Wei )
    | LoadDisputeResolvedEvent ( Int, Address, Wei, Wei )
    | None
