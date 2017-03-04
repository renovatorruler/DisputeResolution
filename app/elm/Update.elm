module Update exposing (..)

import Msgs exposing (Msg(..))
import Parties.Party exposing (Party)

update : Msg -> Party -> ( Party, Cmd Msg)
update msg party =
  case msg of
    NoOp ->
      ( party, Cmd.none )
