module Msgs exposing (..)

import Models exposing (Address, Parties, Brehons)


type Msg
    = LoadAccounts (List String)
    | LoadDeployedAt Address
    | LoadAllParties Parties
    | LoadAllBrehons Brehons
