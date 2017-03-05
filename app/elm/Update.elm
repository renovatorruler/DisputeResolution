module Update exposing (..)

import Msgs exposing (Msg(..))
import Models exposing (Model, Address)


update : Msg -> Model -> ( Model, Cmd Msg )
update msg model =
    case msg of
        Msgs.LoadAccounts accounts ->
            ( { model | deployedAt = List.head accounts }, Cmd.none )
