module View exposing (..)

import Html exposing (Html, div, text)
import Html.Attributes exposing (class)
import Msgs exposing (Msg)
import Models exposing (Model)


view : Model -> Html Msg
view model =
    div []
        [ text "Main View"
        , page model
        ]


page : Model -> Html Msg
page model =
    div []
        [ text "PartyA View"
        , div [ class "p2" ]
            [ text "Address: "
            , text model.partyA.addr
            ]
        , div [ class "p2" ]
            [ text "Deposit: "
            , text (toString model.partyA.deposit)
            ]
        ]
