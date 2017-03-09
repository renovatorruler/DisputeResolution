module Msgs exposing (..)

import Models exposing (Address, Wei, PartyModel, BrehonModel, Parties, Brehons)


type Msg
    = LoadAccounts (List Address)
    | LoadDeployedAt Address
    | LoadAllParties Parties
    | LoadAllBrehons Brehons
    | AcceptContractByParty PartyModel
    | AcceptContractByBrehon BrehonModel
    | DepositFieldChanged Wei
    | DepositFunds PartyModel
    | None
