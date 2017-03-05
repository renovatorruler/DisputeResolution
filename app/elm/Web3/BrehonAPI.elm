port module Web3.BrehonAPI exposing (..)


port requestAccounts : Int -> Cmd msg


port receiveAccounts : (List String -> msg) -> Sub msg
