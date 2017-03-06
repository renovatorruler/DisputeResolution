module Update exposing (..)

import Msgs exposing (..)
import Models exposing (Model, Address)


update : Msg -> Model -> ( Model, Cmd Msg )
update msg model =
    case msg of
        LoadAccounts accounts ->
            ( model, Cmd.none )

        LoadDeployedAt deployedAddr ->
            ( { model | deployedAt = deployedAddr }, Cmd.none )
