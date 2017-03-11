module View exposing (..)

import Html exposing (Html, Attribute, a, button, div, img, input, p, text)
import Html.Attributes exposing (class, href, src, type_, placeholder)
import Html.Events exposing (onClick, onInput)
import Msgs exposing (Msg)
import Models exposing (Model, Address, Wei, PartyModel, BrehonModel, FilePath)


view : Model -> Html Msg
view model =
    div [ class "main-container lg-h3 md-h4 sm-h6" ]
        [ contractDetailView model
        , div [ class "party-list flex flex-wrap" ]
            [ partyView model.partyA "images/partyA.png" model.loadedAccount
            , partyView model.partyB "images/partyB.png" model.loadedAccount
            ]
        , div [ class "brehon-list flex flex-wrap flex-column" ]
            [ brehonView model.primaryBrehon "images/partyPrimaryBrehon.png" model.loadedAccount
            , brehonView model.secondaryBrehon "images/partySecondaryBrehon.png" model.loadedAccount
            , brehonView model.tertiaryBrehon "images/partyTertiaryBrehon.png" model.loadedAccount
            ]
        ]


contractDetailView : Model -> Html Msg
contractDetailView model =
    div [ class "contract-detail p2" ]
        [ div []
            [ text "Contract Deployed At: "
            , textAddress model.deployedAt
            ]
        , div []
            [ text "Loaded Account: "
            , textAddress model.loadedAccount
            ]
        ]


partyView : PartyModel -> FilePath -> Address -> Html Msg
partyView party profileImage loadedAccount =
    let
        ownerView =
            loadedAccount == party.struct.addr
    in
        div [ class "party-view mx-auto max-width-2 border rounded m1 p2" ]
            [ text "Party"
            , div [ class "block" ]
                [ img [ src profileImage ] []
                , text "Address: "
                , textAddress party.struct.addr
                ]
            , div [ class "block my1" ]
                [ div [ class "my1" ]
                    [ text "Deposit: "
                    , text party.struct.deposit
                    , text " Wei"
                    ]
                , depositView ownerView party
                ]
            , contractAcceptanceView party.struct.contractAccepted ownerView (Msgs.AcceptContractByParty party)
            ]


brehonView : BrehonModel -> FilePath -> Address -> Html Msg
brehonView brehon profileImage loadedAccount =
    let
        ownerView =
            loadedAccount == brehon.struct.addr
    in
        div [ class "brehon-view mx-auto max-width-2 border rounded m1 p2" ]
            [ text "Brehon"
            , div [ class "block" ]
                [ img [ src profileImage ] []
                , p [] [ text "Address: " ]
                , textAddress brehon.struct.addr
                ]
            , contractAcceptanceView brehon.struct.contractAccepted ownerView (Msgs.AcceptContractByBrehon brehon)
            ]


depositView : Bool -> PartyModel -> Html Msg
depositView ownerView party =
    case ownerView && party.struct.contractAccepted of
        True ->
            div [ class "deposit-funds my1 clearfix" ]
                [ input
                    [ class "input left col-8"
                    , placeholder "0 Wei"
                    , type_ "number"
                    , onInput Msgs.DepositFieldChanged
                    ]
                    []
                , a
                    [ class "btn col-3 rounded white bg-olive right"
                    , href "#"
                    , onClick (Msgs.DepositFunds party)
                    ]
                    [ text "Deposit" ]
                ]

        False ->
            div [] []


contractAcceptanceView : Bool -> Bool -> Msg -> Html Msg
contractAcceptanceView isContractAccepted ownerView messageDispatch =
    case isContractAccepted of
        True ->
            p [ class "center" ]
                [ text "Contract Accepted"
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
                p [ class "center" ] [ text "Contract Not Accepted" ]


textAddress : Address -> Html Msg
textAddress address =
    case address of
        Nothing ->
            p [ class "" ]
                [ text "<Unassigned>"
                ]

        Just val ->
            p [ class "" ]
                [ text val
                ]
