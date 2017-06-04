module Create.Update exposing (..)

import Msgs exposing (..)
import Models exposing (ContractCreatorModel)


updateCreateContract : Msg -> ContractCreatorModel -> ( ContractCreatorModel, Cmd Msg )
updateCreateContract msg model =
    case msg of
        PartyAAddrChanged addr ->
            ( { model | partyA = Just addr }, Cmd.none )

        _ ->
            ( model, Cmd.none )
