port module Web3.BrehonAPI exposing (..)


port getAccounts : String -> Cmd msg


port receiveAccounts : (List String -> msg) -> Sub msg
