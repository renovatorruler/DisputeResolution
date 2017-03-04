module View exposing (..)

import Html exposing (Html, div, text)
import Msgs exposing (Msg)
import Parties.Party exposing (Party)
import Parties.View

view : Party -> Html Msg
view party =
  div []
      [ text "Main View"
      , page party ]


page : Party -> Html Msg
page party =
    Parties.View.view party
