module Msgs exposing (..)

import Models exposing (Address, Party, Brehon, Parties, Brehons)


type Msg
    = LoadAccounts (List Address)
    | LoadDeployedAt Address
    | LoadAllParties Parties
    | LoadAllBrehons Brehons
    | AcceptContractByParty Party
    | AcceptContractByBrehon Brehon
