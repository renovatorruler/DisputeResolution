module View exposing (..)

import Html exposing (Html, Attribute, a, button, div, img, input, p, text)
import Html.Attributes exposing (class, href, src, type_, placeholder)
import Html.Events exposing (onClick)
import Msgs exposing (Msg)
import Models exposing (Model, Address, Party, Brehon, FilePath)


view : Model -> Html Msg
view model =
    div [ class "main-container" ]
        [ text "Main View "
        , contractDetailView model
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


partyView : Party -> FilePath -> Address -> Html Msg
partyView party profileImage loadedAccount =
    let
        ownerView =
            loadedAccount == party.addr
    in
        div [ class "party-view mx-auto max-width-2 border rounded m1 py1 px2 bg-silver" ]
            [ text "Party View"
            , div [ class "" ]
                [ img [ src profileImage ] []
                , text "Address: "
                , textAddress party.addr
                ]
            , div [ class "block my1" ]
                [ div []
                    [ text "Deposit: "
                    , text (toString party.deposit)
                    ]
                , depositView ownerView party.contractAccepted
                ]
            , contractAcceptanceView party.contractAccepted ownerView (Msgs.AcceptContractByParty party)
            ]


brehonView : Brehon -> FilePath -> Address -> Html Msg
brehonView brehon profileImage loadedAccount =
    let
        ownerView =
            loadedAccount == brehon.addr
    in
        div [ class "brehon-view mx-auto max-width-2 border m1 p1" ]
            [ text "Brehon View"
            , div [ class "block" ]
                [ img [ src profileImage ] []
                , text "Address: "
                , textAddress brehon.addr
                ]
            , contractAcceptanceView brehon.contractAccepted ownerView (Msgs.AcceptContractByBrehon brehon)
            ]


depositView : Bool -> Bool -> Html Msg
depositView ownerView isContractAccepted =
    case ownerView && isContractAccepted of
        True ->
            div [ class "deposit-funds clearfix" ]
                [ input
                    [ class "input left max-width-1", placeholder "0 Ethers", type_ "number" ]
                    []
                , a
                    [ class "btn btn-narrow rounded white bg-olive right", href "#", onClick Msgs.None ]
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
                div [ class "mx-auto max-width-1" ]
                    [ button
                        [ class "btn btn-primary btn-big"
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
            p []
                [ text "<Unassigned>"
                ]

        Just val ->
            p [ class "max-width-1" ]
                [ text val
                ]
