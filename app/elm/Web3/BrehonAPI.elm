port module Web3.BrehonAPI exposing (..)

import Models exposing (Address)


port requestAccounts : Int -> Cmd msg


port receiveAccounts : (List String -> msg) -> Sub msg


port requestDeployedAt : Int -> Cmd msg


port receiveDeployedAt : (Address -> msg) -> Sub msg


port requestAllAddresses : Int -> Cmd msg


port receiveAllAddresses : (List Address -> msg) -> Sub msg
