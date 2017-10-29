port module Main exposing (..)

import Msgs exposing (Msg)
import Models exposing (Model, Party, zeroWei, initContractModel, initContractCreatorModel, Brehon, PartyModel, BrehonModel, ContractInfo, Stage(..))
import Time exposing (every, minute, second)
import View exposing (view)
import Update exposing (update)
import Web3.BrehonAPI exposing (..)
import Commands exposing (..)
import Navigation
import UrlParser as Url
import UrlParsing exposing (..)


-- MODEL


init : Navigation.Location -> ( Model, Cmd Msg )
init location =
    ( Model
        [ Url.parseHash route location ]
        (Just Create)
        initContractCreatorModel
        initContractModel
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
    Navigation.program Msgs.UrlChange
        { init = init
        , view = view
        , update = update
        , subscriptions = subscriptions
        }
