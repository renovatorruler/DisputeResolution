module View exposing (..)

import Html exposing (Html, div, img, text)
import Html.Attributes exposing (class, src)
import Msgs exposing (Msg)
import Models exposing (Model, Address, Party, Brehon)


view : Model -> Html Msg
view model =
    div [ class "" ]
        [ text "Main View "
        , contractDetailView model
        , div [ class "flex flex-wrap" ]
            [ partyView model.partyA
            , partyView model.partyB
            ]
        , div [ class "flex flex-wrap flex-column" ]
            [ brehonView model.primaryBrehon
            , brehonView model.secondaryBrehon
            , brehonView model.tertiaryBrehon
            ]
        ]


contractDetailView : Model -> Html Msg
contractDetailView model =
    div [ class "p2" ]
        [ text "Contract Deployed At: "
        , textAddress model.deployedAt
        ]


partyView : Party -> Html Msg
partyView party =
    div [ class "mx-auto max-width-1 border my1" ]
        [ text "Party View"
        , div []
            [ img [ src party.profileImage ] []
            , text "Address: "
            , textAddress party.addr
            ]
        , div []
            [ text "Deposit: "
            , text (toString party.deposit)
            ]
        ]


brehonView : Brehon -> Html Msg
brehonView brehon =
    div [ class "mx-auto max-width-1 border my1" ]
        [ text "Brehon View"
        , div []
            [ img [ src brehon.profileImage ] []
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
