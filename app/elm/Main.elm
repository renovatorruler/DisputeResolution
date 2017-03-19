port module Main exposing (..)

import Html exposing (Html, div, text, program)
import Msgs exposing (Msg)
import Models exposing (Model, Party, zeroWei, initContractInfo, Brehon, PartyModel, BrehonModel, ContractInfo, Stage(..))
import View exposing (view)
import Update exposing (update)
import Web3.BrehonAPI exposing (..)
import Commands exposing (..)


-- MODEL


init : ( Model, Cmd Msg )
init =
    ( Model
        initContractInfo
        []
        Nothing
        zeroWei
        zeroWei
        zeroWei
        zeroWei
        (PartyModel (Party Nothing zeroWei False))
        (PartyModel (Party Nothing zeroWei False))
        (BrehonModel (Brehon Nothing False zeroWei zeroWei))
        (BrehonModel (Brehon Nothing False zeroWei zeroWei))
        (BrehonModel (Brehon Nothing False zeroWei zeroWei))
    , Cmd.batch
        [ loadWeb3Accounts
        , loadContractInfo
        , loadProposedSettlement
        , loadAllParties
        , loadAllBrehons
        , loadAllEvents
        ]
    )



-- SUBSCRIPTIONS


subscriptions : Model -> Sub Msg
subscriptions model =
    Sub.batch
        [ receiveAccounts Msgs.LoadAccounts
        , receiveContractInfo Msgs.LoadContractInfo
        , receiveProposedSettlement Msgs.LoadProposedSettlement
        , receiveAllParties Msgs.LoadAllParties
        , receiveAllBrehons Msgs.LoadAllBrehons
        , receiveExecutionStartedEvent Msgs.LoadExecutionStartedEvent
        , receiveSettlementProposedEvent Msgs.LoadSettlementProposedEvent
        , receiveDisputeResolvedEvent Msgs.LoadDisputeResolvedEvent
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
