port module Web3.BrehonAPI exposing (..)

import Models exposing (Address, Parties, Party, Brehon, Brehons)


port requestAccounts : Int -> Cmd msg


port receiveAccounts : (List Address -> msg) -> Sub msg


port requestDeployedAt : Int -> Cmd msg


port receiveDeployedAt : (Address -> msg) -> Sub msg


port requestAllParties : Int -> Cmd msg


port receiveAllParties : (Parties -> msg) -> Sub msg


port requestAllBrehons : Int -> Cmd msg


port receiveAllBrehons : (Brehons -> msg) -> Sub msg


port requestAcceptContractByParty : Party -> Cmd msg


port requestAcceptContractByBrehon : Brehon -> Cmd msg


port requestConsoleLog : String -> Cmd msg
