module View exposing (..)

import Html exposing (Html, Attribute, a, button, div, ul, li, img, input, label, p, span, i, text)
import Html.Attributes exposing (class, href, src, type_, placeholder)
import Html.Events exposing (onClick, onInput)
import Time exposing (now)
import Time.DateTime as DateTime exposing (toISO8601, fromTimestamp)
import Msgs exposing (Msg)
import Models exposing (Model, Address, Event(..), ContractInfo, Settlement, Awards, Wei, PartyModel, BrehonModel, FilePath, Stage(..))


view : Model -> Html Msg
view model =
    div [ class "main-container lg-h4 md-h4 sm-h4 clearfix" ]
        [ contractDetailView model
        , div [ class "col col-8" ]
            [ div [ class "party-list flex flex-wrap" ]
                [ partyView model.partyA "images/partyA.png" model
                , partyView model.partyB "images/partyB.png" model
                ]
            , div [ class "brehon-list flex flex-wrap flex-column" ]
                [ brehonView model.primaryBrehon "images/partyPrimaryBrehon.png" model
                , brehonView model.secondaryBrehon "images/partySecondaryBrehon.png" model
                , brehonView model.tertiaryBrehon "images/partyTertiaryBrehon.png" model
                ]
            ]
        , div [ class "col col-2 lg-h4 sm-h6" ] [ logView model ]
        ]


contractDetailView : Model -> Html Msg
contractDetailView model =
    let
        showProposedSettlement =
            model.contractInfo.stage /= Completed

        showActiveBrehon =
            model.contractInfo.stage == Dispute
    in
        ul [ class "contract-detail sm-h5 p2 col col-2 list-reset" ]
            [ li []
                [ text "Contract Deployed At: "
                , textAddress model.contractInfo.deployedAt
                ]
            , li []
                [ text "Current Time: "
                , model.currentTimestamp
                    |> fromTimestamp
                    |> toISO8601
                    |> text
                ]
            , li []
                [ text "Loaded Account: "
                , textAddress model.loadedAccount
                ]
            , li []
                [ text "Total Deposits: "
                , text model.totalDeposits
                , text " Wei"
                ]
            , li []
                [ text "Minimum Amount to start the contract: "
                , text model.contractInfo.minimumContractAmt
                , text " Wei"
                ]
            , li []
                [ text "Contract Stage: "
                , text (toString model.contractInfo.stage)
                ]
            , li []
                [ text "Transaction Amount : "
                , text model.contractInfo.transactionAmount
                ]
            , li []
                [ text "Parties Accepted : "
                , text (toString model.contractInfo.partiesAccepted)
                ]
            , li []
                [ text "Brehons Accepted : "
                , text (toString model.contractInfo.brehonsAccepted)
                ]
            , li []
                [ proposedSettlementView model.contractInfo.proposedSettlement
                ]
                |> conditionalBlock showProposedSettlement
            , li []
                [ text "Active Brehon: "
                , textAddress model.contractInfo.activeBrehon
                ]
                |> conditionalBlock showActiveBrehon
            , li []
                [ text "Appeal Period Start time: "
                , text
                    (model.contractInfo.appealPeriodStart
                        |> toJustString toISO8601
                    )
                ]
                |> justValue model.contractInfo.appealPeriodStart
            , li []
                [ text "Appeal Period Duration (days): "
                , text (toString model.contractInfo.appealPeriodInDays)
                ]
                |> justValue model.contractInfo.appealPeriodEnd
            , li []
                [ text "Appeal Period End time: "
                , text
                    (model.contractInfo.appealPeriodEnd
                        |> toJustString toISO8601
                    )
                ]
                |> justValue model.contractInfo.appealPeriodEnd
            , li []
                [ awardsView model.contractInfo.awards
                ]
                |> justValue model.contractInfo.awards
            ]


canPartyStartContract : PartyModel -> ContractInfo -> Wei -> Bool
canPartyStartContract party contractInfo totalDeposits =
    (contractInfo.partiesAccepted && contractInfo.brehonsAccepted)
        && contractInfo.stage
        == Negotiation
        && party.struct.contractAccepted
        && totalDeposits
        >= contractInfo.minimumContractAmt


canPartyProposeSettlement : PartyModel -> ContractInfo -> Bool
canPartyProposeSettlement party contractInfo =
    contractInfo.stage
        /= Negotiation
        && contractInfo.stage
        /= Completed


canPartyAcceptSettlement : PartyModel -> ContractInfo -> Bool
canPartyAcceptSettlement party contractInfo =
    case contractInfo.proposedSettlement of
        Nothing ->
            False

        Just settlement ->
            settlement.proposingPartyAddr
                /= party.struct.addr
                && contractInfo.stage
                /= Completed


canPartyWithdrawFunds : PartyModel -> ContractInfo -> Bool
canPartyWithdrawFunds party contractInfo =
    contractInfo.stage
        == Completed
        || (contractInfo.stage
                == AppealPeriod
                && not contractInfo.appealPeriodInProgress
           )


canPartyRaiseDispute : PartyModel -> ContractInfo -> Bool
canPartyRaiseDispute party contractInfo =
    contractInfo.stage
        == Execution


canPartyAppeal : PartyModel -> ContractInfo -> Bool
canPartyAppeal party contractInfo =
    contractInfo.stage
        == AppealPeriod


canDepositIntoContract : PartyModel -> ContractInfo -> Bool
canDepositIntoContract party contractInfo =
    party.struct.contractAccepted
        && contractInfo.stage
        /= Completed


partyView : PartyModel -> FilePath -> Model -> Html Msg
partyView party profileImage model =
    let
        ownerView =
            model.loadedAccount == party.struct.addr

        canDeposit =
            ownerView
                && canDepositIntoContract party model.contractInfo

        canStartContract =
            ownerView
                && canPartyStartContract party model.contractInfo model.totalDeposits

        canProposeSettlement =
            ownerView
                && canPartyProposeSettlement party model.contractInfo

        canAcceptSettlement =
            ownerView
                && canPartyAcceptSettlement party model.contractInfo

        canWithdrawFunds =
            ownerView
                && canPartyWithdrawFunds party model.contractInfo

        canRaiseDispute =
            ownerView
                && canPartyRaiseDispute party model.contractInfo

        canAppeal =
            ownerView
                && canPartyAppeal party model.contractInfo

        viewClass ownerView cssClass =
            case ownerView of
                True ->
                    cssClass ++ " white bg-maroon border-gray"

                False ->
                    cssClass
    in
        div
            [ "party-view mx-auto max-width-1 border rounded m1 p2"
                |> viewClass ownerView
                |> class
            ]
            [ text "Party"
            , div [ class "block p1" ]
                [ img [ src profileImage ] []
                , text "Address: "
                , textAddress party.struct.addr
                ]
            , div [ class "block p1" ]
                [ contractAcceptanceView party.struct.contractAccepted ownerView (Msgs.AcceptContractByParty party)
                ]
            , div [ class "deposit-block block my1 p1" ]
                [ div [ class "my1" ]
                    [ text "Deposit: "
                    , text party.struct.deposit
                    , text " Wei"
                    ]
                , depositView party
                ]
                |> conditionalBlock canDeposit
            , div
                [ class "block my1 p1" ]
                [ startContractView party
                ]
                |> conditionalBlock canStartContract
            , div
                [ class "block my2 p1 border" ]
                [ label [ class "label label-title bg-maroon h4" ] [ text "Settlement" ]
                , proposeSettlementView party
                ]
                |> conditionalBlock canProposeSettlement
            , div
                [ class "block my2 p1 border" ]
                [ acceptSettlementView party model.contractInfo.proposedSettlement
                ]
                |> conditionalBlock canAcceptSettlement
            , div
                [ class "block my1 p1" ]
                [ withdrawFundsView party.struct.addr ]
                |> conditionalBlock canWithdrawFunds
            , div
                [ class "block my1 p1" ]
                [ raiseDisputeView party.struct.addr ]
                |> conditionalBlock canRaiseDispute
            , div
                [ class "block my1 p1" ]
                [ appealView party.struct.addr ]
                |> conditionalBlock canAppeal
            ]


withdrawFundsView : Address -> Html Msg
withdrawFundsView addr =
    div [ class "withdraw-funds" ]
        [ a
            [ class "btn btn-big btn-primary block center rounded h2 black bg-yellow"
            , href "#"
            , onClick (Msgs.WithdrawFunds addr)
            ]
            [ text "Withdraw Funds" ]
        ]


raiseDisputeView : Address -> Html Msg
raiseDisputeView addr =
    div [ class "raise-dispute" ]
        [ a
            [ class "btn btn-big btn-primary block center rounded h2 white bg-red"
            , href "#"
            , onClick (Msgs.RaiseDispute addr)
            ]
            [ text "Raise Dispute" ]
        ]


appealView : Address -> Html Msg
appealView addr =
    div [ class "appeal" ]
        [ a
            [ class "btn btn-big btn-primary block center rounded h2 black bg-aqua"
            , href "#"
            , onClick (Msgs.RaiseAppeal addr)
            ]
            [ text "Appeal" ]
        ]


ctaButton : String -> String -> Msg -> Html Msg
ctaButton label cssClass msg =
    a
        [ class ("btn btn-big btn-primary block center rounded h2 " ++ cssClass)
        , href "#"
        , onClick msg
        ]
        [ text label ]


proposeSettlementView : PartyModel -> Html Msg
proposeSettlementView party =
    div [ class "propose-settlement" ]
        [ label [ class "label" ] [ text "Award for Party A" ]
        , input
            [ class "input"
            , placeholder "0 Wei"
            , onInput Msgs.SettlementPartyAFieldChanged
            ]
            []
        , label [ class "label" ] [ text "Award for Party B" ]
        , input
            [ class "input"
            , placeholder "0 wei"
            , onInput Msgs.SettlementPartyBFieldChanged
            ]
            []
        , button
            [ class "btn btn-primary"
            , onClick (Msgs.ProposeSettlement party)
            ]
            [ text "Propose Settlement" ]
        ]


acceptSettlementView : PartyModel -> Maybe Settlement -> Html Msg
acceptSettlementView party proposedSettlement =
    case proposedSettlement of
        Nothing ->
            div [] []

        Just settlement ->
            div [ class "accept-settlement" ]
                [ label [ class "label h4" ]
                    [ text "Award for Party A: "
                    , text settlement.settlementPartyA
                    ]
                , label [ class "label h4" ]
                    [ text "Award for Party B: "
                    , text settlement.settlementPartyB
                    ]
                , button
                    [ class "btn btn-primary"
                    , onClick (Msgs.AcceptSettlement party)
                    ]
                    [ text "Accept Settlement" ]
                ]


proposedSettlementView : Maybe Settlement -> Html Msg
proposedSettlementView proposedSettlement =
    case proposedSettlement of
        Nothing ->
            div [] []

        Just settlement ->
            div []
                [ div []
                    [ text "Proposing Party: "
                    , textAddress settlement.proposingPartyAddr
                    ]
                , div []
                    [ text "Award Party A: "
                    , text settlement.settlementPartyA
                    ]
                , div []
                    [ text "Award Party B: "
                    , text settlement.settlementPartyB
                    ]
                ]


awardsView : Maybe Awards -> Html Msg
awardsView awards =
    case awards of
        Nothing ->
            div [] []

        Just awards ->
            div []
                [ div []
                    [ text "Award Party A: "
                    , text awards.awardPartyA
                    ]
                , div []
                    [ text "Award Party B: "
                    , text awards.awardPartyB
                    ]
                ]


brehonView : BrehonModel -> FilePath -> Model -> Html Msg
brehonView brehon profileImage model =
    let
        ownerView =
            model.loadedAccount == brehon.struct.addr

        canAdjudicate =
            ownerView
                && canBrehonAdjudicate brehon model.contractInfo

        viewClass ownerView cssClass =
            case ownerView of
                True ->
                    cssClass ++ " white bg-maroon border-gray"

                False ->
                    cssClass
    in
        div
            [ "brehon-view mx-auto max-width-1 border rounded m1 p2"
                |> viewClass ownerView
                |> class
            ]
            [ text "Brehon"
            , div [ class "block p1" ]
                [ img [ src profileImage ] []
                , p []
                    [ text "Address: "
                    , textAddress brehon.struct.addr
                    ]
                , p []
                    [ text "Fixed Fee: "
                    , text brehon.struct.fixedFee
                    ]
                , p []
                    [ text "Dispute Fee: "
                    , text brehon.struct.disputeFee
                    ]
                ]
            , div
                [ class "block my1 p1" ]
                [ contractAcceptanceView brehon.struct.contractAccepted ownerView (Msgs.AcceptContractByBrehon brehon) ]
            , div
                [ class "block my1 p1" ]
                [ adjudicateView brehon ]
                |> conditionalBlock canAdjudicate
            , div
                [ class "block my1 p1" ]
                [ awardsView brehon.awards ]
            ]


canBrehonAdjudicate : BrehonModel -> ContractInfo -> Bool
canBrehonAdjudicate brehon contractInfo =
    contractInfo.stage
        == Dispute


adjudicateView : BrehonModel -> Html Msg
adjudicateView brehon =
    div [ class "adjudicate" ]
        [ label [ class "label" ] [ text "Award for Party A" ]
        , input
            [ class "input"
            , placeholder "0 Wei"
            , onInput Msgs.SettlementPartyAFieldChanged
            ]
            []
        , label [ class "label" ] [ text "Award for Party B" ]
        , input
            [ class "input"
            , placeholder "0 wei"
            , onInput Msgs.SettlementPartyBFieldChanged
            ]
            []
        , button
            [ class "btn btn-primary"
            , onClick (Msgs.Adjudicate brehon)
            ]
            [ text "Adjudicate" ]
        ]


startContractView : PartyModel -> Html Msg
startContractView party =
    a
        [ class "btn btn-big btn-primary block center rounded h2 black bg-yellow"
        , href "#"
        , onClick (Msgs.StartContract party)
        ]
        [ text "Start Contract" ]


depositView : PartyModel -> Html Msg
depositView party =
    div [ class "deposit-funds my1 clearfix flex" ]
        [ input
            [ class "input mb0 mr2"
            , placeholder "0 Wei"
            , type_ "number"
            , onInput Msgs.DepositFieldChanged
            ]
            []
        , a
            [ class "btn center rounded white bg-olive"
            , href "#"
            , onClick (Msgs.DepositFunds party)
            ]
            [ text "Deposit" ]
        ]


contractAcceptanceView : Bool -> Bool -> Msg -> Html Msg
contractAcceptanceView isContractAccepted ownerView messageDispatch =
    case isContractAccepted of
        True ->
            p []
                [ i [ class "fa fa-check-circle mr1 green" ] []
                , text "Contract Accepted"
                ]

        False ->
            if ownerView then
                div [ class "fit" ]
                    [ button
                        [ class "btn btn-primary btn-big block mx-auto"
                        , type_ "button"
                        , onClick (messageDispatch)
                        ]
                        [ text "Accept Contract" ]
                    ]
            else
                p []
                    [ i [ class "fa fa-minus-square mr1 red" ] []
                    , text "Contract Not Accepted"
                    ]


logView : Model -> Html Msg
logView model =
    ul [ class "list-reset" ]
        (model.eventLog
            |> List.map singleLogView
        )


singleLogView : Event -> Html Msg
singleLogView event =
    case event of
        ExecutionStartedEvent blockNumber txHash caller totalDeposits ->
            li [ class "mb2" ]
                [ i [ class "fa fa-paper-plane mr1" ] []
                , text "Contract started by "
                , textAddress caller
                , text " with a total deposit of "
                , text totalDeposits
                ]

        SettlementProposedEvent blockNumber txHash proposingParty awardPartyA awardPartyB ->
            li [ class "mb2" ]
                [ i [ class "fa fa-money mr1" ] []
                , text "Settlement proposed by "
                , textAddress proposingParty
                , text " with an award of "
                , text awardPartyA
                , text " for Party A and "
                , text awardPartyB
                , text " for Party B"
                ]

        DisputeResolvedEvent blockNumber txHash awardPartyA awardPartyB ->
            li [ class "mb2" ]
                [ i [ class "fa fa-hand-peace-o mr1" ] []
                , text "Resolution reached "
                , text " with an award of "
                , text awardPartyA
                , text " for Party A and "
                , text awardPartyB
                , text " for Party B"
                ]

        ContractDisputedEvent disputingParty activeBrehon ->
            li [ class "mb2" ]
                [ i [ class "fa fa-fire mr1" ] []
                , text "Dispute raised "
                , text " by "
                , textAddress disputingParty
                , text ". Brehon "
                , textAddress activeBrehon
                , text " is presiding."
                ]

        AppealPeriodStartedEvent appealLevel startTime activeBrehon awardPartyA awardPartyB ->
            li [ class "mb2" ]
                [ i [ class "fa fa-gavel mr1" ] []
                , text "Brehon "
                , textAddress activeBrehon
                , text " provided a judgment by awarding "
                , text awardPartyA
                , text " to partyA and "
                , text awardPartyB
                , text " to partyB at "
                , text (toISO8601 startTime)
                ]

        AppealRaisedEvent appealLevel appealingParty activeBrehon ->
            li [ class "mb2" ]
                [ i [ class "fa fa-fire mr1" ] []
                , text "Appeal raised "
                , text " by "
                , textAddress appealingParty
                , text ". Brehon "
                , textAddress activeBrehon
                , text " is presiding."
                ]

        FundsClaimedEvent claimingParty amount ->
            li [ class "mb2" ]
                [ i [ class "fa fa-money mr1" ] []
                , text "Funds claimed "
                , text " by "
                , textAddress claimingParty
                , text " in the amount of "
                , text amount
                ]


textAddress : Address -> Html Msg
textAddress address =
    case address of
        Nothing ->
            span [ class "" ]
                [ text "<Unassigned>"
                ]

        Just val ->
            span [ class "address char-10" ]
                [ text val
                ]


conditionalBlock : Bool -> Html Msg -> Html Msg
conditionalBlock flag htmlEl =
    case flag of
        True ->
            htmlEl

        False ->
            text ""


justValue : Maybe a -> Html Msg -> Html Msg
justValue a htmlEl =
    case a of
        Nothing ->
            text ""

        Just a ->
            htmlEl


toJustString : (a -> String) -> Maybe a -> String
toJustString fn a =
    case a of
        Nothing ->
            ""

        Just a ->
            fn a
