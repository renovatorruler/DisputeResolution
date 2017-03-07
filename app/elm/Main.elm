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
        (Party "images/partyA.png" (Nothing) 0 False)
        (Party "images/partyB.png" (Nothing) 0 False)
        (Brehon "images/partyPrimaryBrehon.png" (Nothing) False)
        (Brehon "images/partySecondaryBrehon.png" (Nothing) False)
        (Brehon "images/partyTertiaryBrehon.png" (Nothing) False)
    , Cmd.batch
        [ loadWeb3Accounts
        , loadDeployedAt
        , loadAllAddresses
        ]
    )



-- SUBSCRIPTIONS


subscriptions : Model -> Sub Msg
subscriptions model =
    Sub.batch
        [ receiveAccounts Msgs.LoadAccounts
        , receiveDeployedAt Msgs.LoadDeployedAt
        , receiveAllAddresses Msgs.LoadAllAddresses
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
