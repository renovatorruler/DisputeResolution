module ViewHelpers exposing (..)

import Html exposing (Html, text, span)
import Html.Attributes exposing (class)
import Msgs exposing (Msg)
import Models exposing (Address)


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
