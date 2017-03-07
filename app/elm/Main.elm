port module Main exposing (..)

import Html exposing (Html, div, text, program)
import Msgs exposing (Msg)
import Models exposing (Model, Party, Brehon)
import View exposing (view)
import Update exposing (update)
import Web3.BrehonAPI exposing (..)
import Commands exposing (..)


-- MODEL


init : ( Model, Cmd Msg )
init =
    ( Model
        Nothing
        (Party (Nothing) 0 False)
        (Party (Nothing) 0 False)
        (Brehon (Nothing) False)
        (Brehon (Nothing) False)
        (Brehon (Nothing) False)
    , Cmd.batch
        [ loadWeb3Accounts
        , loadDeployedAt
        , loadAllParties
        , loadAllBrehons
        ]
    )



-- SUBSCRIPTIONS


subscriptions : Model -> Sub Msg
subscriptions model =
    Sub.batch
        [ receiveAccounts Msgs.LoadAccounts
        , receiveDeployedAt Msgs.LoadDeployedAt
        , receiveAllParties Msgs.LoadAllParties
        , receiveAllBrehons Msgs.LoadAllBrehons
        ]



-- MAIN


main : Program Never Model Msg
main =
    program
        { init = init
        , view = view
        , update = update
        , subscriptions = subscriptions
        }
