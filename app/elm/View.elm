module View exposing (..)

import Html exposing (Html, Attribute, button, div, img, text)
import Html.Attributes exposing (class, src)
import Html.Events exposing (onClick)
import Msgs exposing (Msg)
import Models exposing (Model, Address, Party, Brehon, FilePath)


view : Model -> Html Msg
view model =
    div [ class "" ]
        [ text "Main View "
        , contractDetailView model
        , div [ class "flex flex-wrap" ]
            [ partyView model.partyA "images/partyA.png" model.loadedAccount
            , partyView model.partyB "images/partyB.png" model.loadedAccount
            ]
        , div [ class "flex flex-wrap flex-column" ]
            [ brehonView model.primaryBrehon "images/partyPrimaryBrehon.png" model.loadedAccount
            , brehonView model.secondaryBrehon "images/partySecondaryBrehon.png" model.loadedAccount
            , brehonView model.tertiaryBrehon "images/partyTertiaryBrehon.png" model.loadedAccount
            ]
        ]


contractDetailView : Model -> Html Msg
contractDetailView model =
    div [ class "p2" ]
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
    div [ class "mx-auto max-width-1 border my1" ]
        [ text "Party View"
        , div []
            [ img [ src profileImage ] []
            , text "Address: "
            , textAddress party.addr
            ]
        , div []
            [ text "Deposit: "
            , text (toString party.deposit)
            ]
        , contractAcceptanceView party.contractAccepted party.addr loadedAccount (Msgs.AcceptContractByParty party)
        ]


brehonView : Brehon -> FilePath -> Address -> Html Msg
brehonView brehon profileImage loadedAccount =
    div [ class "mx-auto max-width-1 border my1" ]
        [ text "Brehon View"
        , div []
            [ img [ src profileImage ] []
            , text "Address: "
            , textAddress brehon.addr
            ]
        , contractAcceptanceView brehon.contractAccepted brehon.addr loadedAccount (Msgs.AcceptContractByBrehon brehon)
        ]


contractAcceptanceView : Bool -> Address -> Address -> Msg -> Html Msg
contractAcceptanceView isContractAccepted addr loadedAccount messageDispatch =
    case isContractAccepted of
        True ->
            div []
                [ text "Contract Accepted"
                ]

        False ->
            if addr == loadedAccount then
                div []
                    [ button [ onClick (messageDispatch) ] [ text "Accept Contract" ]
                    ]
            else
                div []
                    [ text "Contract Not Accepted"
                    ]


textAddress : Address -> Html Msg
textAddress address =
    case address of
        Nothing ->
            text "<Unassigned>"

        Just val ->
            text val
