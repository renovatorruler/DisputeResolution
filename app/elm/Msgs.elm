module Msgs exposing (..)

import Models exposing (Address)


type Msg
    = LoadAccounts (List String)
    | LoadDeployedAt Address
    | LoadAllAddresses (List Address)
