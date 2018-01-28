port module Main exposing (..)

import Html exposing (Html, div, text, program)
import Msgs exposing (Msg)
import Models exposing (Model, Party, zeroWei, initContractInfo, Brehon, PartyModel, BrehonModel, ContractInfo, Stage(..))
import Time exposing (every, minute, second)
import View exposing (view)
import Update exposing (update)
import Web3.BrehonAPI exposing (..)
import Commands exposing (..)


-- MODEL


init : ( Model, Cmd Msg )
init =
    ( Model
        initContractInfo
        0
        []
        Nothing
        zeroWei
        zeroWei
        zeroWei
        zeroWei
        (PartyModel (Party Nothing zeroWei False))
        (PartyModel (Party Nothing zeroWei False))
        (BrehonModel (Brehon Nothing False zeroWei zeroWei) Nothing)
        (BrehonModel (Brehon Nothing False zeroWei zeroWei) Nothing)
        (BrehonModel (Brehon Nothing False zeroWei zeroWei) Nothing)
    , Cmd.batch
        [ loadWeb3Accounts
        , loadContractInfo
        , loadProposedSettlement
        , loadAllParties
        , loadAllBrehons
        , loadAllEvents
        , updateTimestamp
        ]
    )



-- SUBSCRIPTIONS


subscriptions : Model -> Sub Msg
subscriptions model =
    Sub.batch
        [ receiveAccounts Msgs.LoadAccounts
        , receiveContractInfo Msgs.LoadContractInfo
        , receiveProposedSettlement Msgs.LoadProposedSettlement
        , receiveAwards Msgs.LoadAwards
        , receiveAllParties Msgs.LoadAllParties
        , receiveAllBrehons Msgs.LoadAllBrehons
        , receiveExecutionStartedEvent Msgs.LoadExecutionStartedEvent
        , receiveSettlementProposedEvent Msgs.LoadSettlementProposedEvent
        , receiveDisputeResolvedEvent Msgs.LoadDisputeResolvedEvent
        , receiveContractDisputedEvent Msgs.LoadContractDisputedEvent
        , receiveAppealPeriodStartedEvent Msgs.LoadAppealPeriodStartedEvent
        , receiveAppealRaisedEvent Msgs.LoadAppealRaisedEvent
        , receiveSecondAppealRaisedEvent Msgs.LoadSecondAppealRaisedEvent
        , receiveFundsClaimedEvent Msgs.LoadFundsClaimed
        , every minute Msgs.UpdateTimestamp
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
