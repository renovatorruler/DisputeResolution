module View exposing (..)

import Html exposing (Html, div, img, text)
import Html.Attributes exposing (class, src)
import Msgs exposing (Msg)
import Models exposing (Model, Address, Party, Brehon, FilePath)


view : Model -> Html Msg
view model =
    div [ class "" ]
        [ text "Main View "
        , contractDetailView model
        , div [ class "flex flex-wrap" ]
            [ partyView model.partyA "images/partyA.png"
            , partyView model.partyB "images/partyB.png"
            ]
        , div [ class "flex flex-wrap flex-column" ]
            [ brehonView model.primaryBrehon "images/partyPrimaryBrehon.png"
            , brehonView model.secondaryBrehon "images/partySecondaryBrehon.png"
            , brehonView model.tertiaryBrehon "images/partyTertiaryBrehon.png"
            ]
        ]


contractDetailView : Model -> Html Msg
contractDetailView model =
    div [ class "p2" ]
        [ text "Contract Deployed At: "
        , textAddress model.deployedAt
        ]


partyView : Party -> FilePath -> Html Msg
partyView party profileImage =
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
        ]


brehonView : Brehon -> FilePath -> Html Msg
brehonView brehon profileImage =
    div [ class "mx-auto max-width-1 border my1" ]
        [ text "Brehon View"
        , div []
            [ img [ src profileImage ] []
            , text "Address: "
            , textAddress brehon.addr
            ]
        ]


textAddress : Address -> Html Msg
textAddress address =
    case address of
        Nothing ->
            text "<Unassigned>"

        Just val ->
            text val
