module View exposing (..)

import Html exposing (Html, div, text)
import Html.Attributes exposing (class)
import Msgs exposing (Msg)
import Models exposing (Model, Party, Brehon)


view : Model -> Html Msg
view model =
    div []
        [ text "Main View"
        , partyView model.partyA
        , partyView model.partyB
        , brehonView model.primaryBrehon
        , brehonView model.secondaryBrehon
        , brehonView model.tertiaryBrehon
        ]


partyView : Party -> Html Msg
partyView party =
    div []
        [ text "Party View"
        , div [ class "p2" ]
            [ text "Address: "
            , text party.addr
            ]
        , div [ class "p2" ]
            [ text "Deposit: "
            , text (toString party.deposit)
            ]
        ]


brehonView : Brehon -> Html Msg
brehonView brehon =
    div []
        [ text "Brehon View"
        , div [ class "p2" ]
            [ text "Address: "
            , text brehon.addr
            ]
        ]
