module Main exposing (..)

import Html exposing (Html, div, text, program)
import Msgs exposing (Msg)
import Parties.Models exposing (Party)
import Parties.View exposing (view)
import Update exposing (update)


-- MODEL

init : ( Party, Cmd Msg)
init =
  ( Party "0x0a0s0dd" 0 False, Cmd.none )


-- SUBSCRIPTIONS

subscriptions : Party -> Sub Msg
subscriptions model =
  Sub.none


-- MAIN

main : Program Never Party Msg
main =
  program
    { init = init
    , view = view
    , update = update
    , subscriptions = subscriptions }

