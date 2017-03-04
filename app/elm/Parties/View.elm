module Parties.View exposing (..)

import Html exposing (..)
import Html.Attributes exposing (class)
import Msgs exposing (Msg)
import Parties.Party exposing (Party)


view : Party -> Html Msg
view party =
  div []
      [ text "Party View"
      , div [ class "left p2" ] [ text party.addr ]
      , div [ class "p2" ] [ text (toString party.deposit) ]
      ]

