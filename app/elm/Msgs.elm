module Msgs exposing (..)

import Models exposing (Address, ContractInfo, Wei, PartyModel, BrehonModel, Parties, Brehons)


type Msg
    = LoadAccounts (List Address)
    | LoadContractInfo ( Address, Int, Wei )
    | LoadAllParties Parties
    | LoadAllBrehons Brehons
    | AcceptContractByParty PartyModel
    | AcceptContractByBrehon BrehonModel
    | DepositFieldChanged Wei
    | DepositFunds PartyModel
    | None
