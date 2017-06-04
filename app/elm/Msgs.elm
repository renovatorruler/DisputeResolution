module Msgs exposing (..)

import Time exposing (Time)
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
import Navigation


type Msg
    = UrlChange Navigation.Location
    | LoadAccounts (List Address)
    | LoadContractInfo ( Address, Int, Wei, Wei, Int, Address, Maybe Awards )
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
    | LoadAppealPeriodStartedEvent ( String, Address, Wei, Wei )
    | LoadAppealRaisedEvent ( Address, Address )
    | LoadSecondAppealRaisedEvent ( Address, Address )
    | LoadFundsClaimed ( Address, Wei )
    | UpdateTimestamp Time
    | RaiseDispute Address
    | RaiseAppeal Address
    | RaiseSecondAppeal Address
    | Adjudicate BrehonModel
    | WithdrawFunds Address
      -- ContractCreator Msgs
    | PartyAAddrChanged String
    | PartyBAddrChanged String
    | TxAmountChanged Wei
    | None
