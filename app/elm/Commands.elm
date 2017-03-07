module Commands exposing (..)

import Msgs exposing (Msg)
import Web3.BrehonAPI exposing (..)


loadWeb3Accounts : Cmd Msg
loadWeb3Accounts =
    requestAccounts 0


loadDeployedAt : Cmd Msg
loadDeployedAt =
    requestDeployedAt 0


loadAllAddresses : Cmd Msg
loadAllAddresses =
    requestAllAddresses -1
