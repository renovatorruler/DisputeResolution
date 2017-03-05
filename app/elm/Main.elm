module Main exposing (..)

import Html exposing (Html, div, text, program)
import Msgs exposing (Msg)
import Models exposing (Model, Party, Brehon)
import View exposing (view)
import Update exposing (update)


-- MODEL


init : ( Model, Cmd Msg )
init =
    ( Model
        "0xe234423423"
        (Party "partyA.png" "0x0a0s0dd" 0 False)
        (Party "partyB.png" "0x0a0s3dd" 0 False)
        (Brehon "primaryBrehon.png" "0xprimaryBrehon" False)
        (Brehon "secondaryBrehon.png" "0xsecondaryBrehon" False)
        (Brehon "tertiaryBrehon.png" "0xtertiaryBrehon" False)
    , Cmd.none
    )



-- SUBSCRIPTIONS


subscriptions : Model -> Sub Msg
subscriptions model =
    Sub.none



-- MAIN


main : Program Never Model Msg
main =
    program
        { init = init
        , view = view
        , update = update
        , subscriptions = subscriptions
        }