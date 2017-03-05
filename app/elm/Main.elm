port module Main exposing (..)

import Html exposing (Html, div, text, program)
import Msgs exposing (Msg)
import Models exposing (Model, Party, Brehon)
import View exposing (view)
import Update exposing (update)
import Web3.BrehonAPI exposing (getAccounts, receiveAccounts)
import Commands exposing (loadWeb3Accounts)


-- MODEL


init : ( Model, Cmd Msg )
init =
    ( Model
        Nothing
        (Party "partyA.png" (Just "0x0a0s0dd") 0 False)
        (Party "partyB.png" (Just "0x0a0s3dd") 0 False)
        (Brehon "primaryBrehon.png" (Just "0xprimaryBrehon") False)
        (Brehon "secondaryBrehon.png" (Just "0xsecondaryBrehon") False)
        (Brehon "tertiaryBrehon.png" (Just "0xtertiaryBrehon") False)
    , loadWeb3Accounts
    )



-- SUBSCRIPTIONS


subscriptions : Model -> Sub Msg
subscriptions model =
    receiveAccounts Msgs.LoadAccounts



-- MAIN


main : Program Never Model Msg
main =
    program
        { init = init
        , view = view
        , update = update
        , subscriptions = subscriptions
        }
