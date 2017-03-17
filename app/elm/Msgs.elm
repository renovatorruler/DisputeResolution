module Msgs exposing (..)

import Models exposing (Address, ContractInfo, Settlement, Wei, PartyModel, BrehonModel, Parties, Brehons, SettlementProposedEvent, DisputeResolvedEvent, ExecutionStartedEvent)


type Msg
    = LoadAccounts (List Address)
    | LoadContractInfo ( Address, Int, Wei )
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
    | LoadSettlementProposedEvent SettlementProposedEvent
    | LoadDisputeResolvedEvent DisputeResolvedEvent
    | LoadExecutionStartedEvent ExecutionStartedEvent
    | None
