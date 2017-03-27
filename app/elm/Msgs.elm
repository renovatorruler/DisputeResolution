module Msgs exposing (..)

import Models
    exposing
        ( Address
        , ContractInfo
        , Settlement
        , Awards
        , Wei
        , PartyModel
        , BrehonModel
        , Parties
        , Brehons
        , Event
        )


type Msg
    = LoadAccounts (List Address)
    | LoadContractInfo ( Address, Int, Wei, Wei, Address, Maybe Awards )
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
    | LoadAwards (Maybe Awards)
    | ProposeSettlement PartyModel
    | AcceptSettlement PartyModel
    | LoadAllEvents
    | LoadExecutionStartedEvent ( Int, Address, Address, Wei )
    | LoadSettlementProposedEvent ( Int, Address, Address, Wei, Wei )
    | LoadDisputeResolvedEvent ( Int, Address, Wei, Wei )
    | LoadContractDisputedEvent ( Address, Address )
    | LoadAppealPeriodStartedEvent ( Int, String, Address, Wei, Wei )
    | LoadFundsClaimed ( Address, Wei )
    | RaiseDispute Address
    | Adjudicate BrehonModel
    | WithdrawFunds Address
    | None
