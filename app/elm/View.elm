module View exposing (..)

import Html exposing (Html, div, text)
import Html.Attributes exposing (class)
import Msgs exposing (Msg)
import Models exposing (Model, Party, Brehon)


view : Model -> Html Msg
view model =
    div []
        [ text "Main View "
        , contractDetailView model
        , partyView model.partyA
        , partyView model.partyB
        , brehonView model.primaryBrehon
        , brehonView model.secondaryBrehon
        , brehonView model.tertiaryBrehon
        ]


contractDetailView : Model -> Html Msg
contractDetailView model =
    div [ class "p2" ]
        [ text "Contract Deployed At: "
        , text model.deployedAt
        ]


partyView : Party -> Html Msg
partyView party =
    div [ class "p2" ]
        [ text "Party View"
        , div []
            [ text "Address: "
            , text party.addr
            ]
        , div []
            [ text "Deposit: "
            , text (toString party.deposit)
            ]
        ]


brehonView : Brehon -> Html Msg
brehonView brehon =
    div [ class "p2" ]
        [ text "Brehon View"
        , div []
            [ text "Address: "
            , text brehon.addr
            ]
        ]
