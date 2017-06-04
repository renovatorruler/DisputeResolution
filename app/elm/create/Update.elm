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

        TermsChanged termsAndConditions ->
            ( { model | termsAndConditions = termsAndConditions }, Cmd.none )

        PrimaryBrehonAddrChanged addr ->
            ( { model | primaryBrehonAddr = Just addr }, Cmd.none )

        PrimaryBrehonFixedFeeChanged fixedFee ->
            ( { model | primaryBrehonFixedFee = fixedFee }, Cmd.none )

        PrimaryBrehonDisputeFeeChanged disputeFee ->
            ( { model | primaryBrehonDisputeFee = disputeFee }, Cmd.none )

        SecondaryBrehonAddrChanged addr ->
            ( { model | secondaryBrehonAddr = Just addr }, Cmd.none )

        SecondaryBrehonFixedFeeChanged fixedFee ->
            ( { model | secondaryBrehonFixedFee = fixedFee }, Cmd.none )

        SecondaryBrehonDisputeFeeChanged disputeFee ->
            ( { model | secondaryBrehonDisputeFee = disputeFee }, Cmd.none )

        TertiaryBrehonAddrChanged addr ->
            ( { model | tertiaryBrehonAddr = Just addr }, Cmd.none )

        TertiaryBrehonFixedFeeChanged fixedFee ->
            ( { model | tertiaryBrehonFixedFee = fixedFee }, Cmd.none )

        TertiaryBrehonDisputeFeeChanged disputeFee ->
            ( { model | tertiaryBrehonDisputeFee = disputeFee }, Cmd.none )

        _ ->
            ( model, Cmd.none )
