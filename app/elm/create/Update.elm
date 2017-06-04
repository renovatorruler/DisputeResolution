module Create.Update exposing (..)

import Msgs exposing (..)
import Models exposing (ContractCreatorModel)


updateCreateContract : Msg -> ContractCreatorModel -> ( ContractCreatorModel, Cmd Msg )
updateCreateContract msg model =
    case msg of
        PartyAAddrChanged addr ->
            ( { model | partyA = Just addr }, Cmd.none )

        PartyBAddrChanged addr ->
            ( { model | partyB = Just addr }, Cmd.none )

        TxAmountChanged amount ->
            ( { model | transactionAmount = amount }, Cmd.none )

        _ ->
            ( model, Cmd.none )
