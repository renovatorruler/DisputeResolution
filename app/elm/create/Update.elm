module Create.Update exposing (..)

import Msgs exposing (..)
import Models exposing (ContractCreatorModel, Wei, Address, Brehon)


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
            ( { model | primaryBrehon = updateBrehonAddr model.primaryBrehon (Just addr) }, Cmd.none )

        PrimaryBrehonFixedFeeChanged fixedFee ->
            ( { model | primaryBrehon = updateBrehonFixedFee model.primaryBrehon fixedFee }, Cmd.none )

        PrimaryBrehonDisputeFeeChanged disputeFee ->
            ( { model | primaryBrehon = updateBrehonDisputeFee model.primaryBrehon disputeFee }, Cmd.none )

        SecondaryBrehonAddrChanged addr ->
            ( { model | secondaryBrehon = updateBrehonAddr model.secondaryBrehon (Just addr) }, Cmd.none )

        SecondaryBrehonFixedFeeChanged fixedFee ->
            ( { model | secondaryBrehon = updateBrehonFixedFee model.secondaryBrehon fixedFee }, Cmd.none )

        SecondaryBrehonDisputeFeeChanged disputeFee ->
            ( { model | secondaryBrehon = updateBrehonDisputeFee model.secondaryBrehon disputeFee }, Cmd.none )

        TertiaryBrehonAddrChanged addr ->
            ( { model | tertiaryBrehon = updateBrehonAddr model.tertiaryBrehon (Just addr) }, Cmd.none )

        TertiaryBrehonFixedFeeChanged fixedFee ->
            ( { model | tertiaryBrehon = updateBrehonFixedFee model.tertiaryBrehon fixedFee }, Cmd.none )

        TertiaryBrehonDisputeFeeChanged disputeFee ->
            ( { model | tertiaryBrehon = updateBrehonDisputeFee model.tertiaryBrehon disputeFee }, Cmd.none )

        _ ->
            ( model, Cmd.none )


updateBrehonAddr : Brehon -> Address -> Brehon
updateBrehonAddr brehon addr =
    { brehon | addr = addr }


updateBrehonFixedFee : Brehon -> Wei -> Brehon
updateBrehonFixedFee brehon fixedFee =
    { brehon | fixedFee = fixedFee }


updateBrehonDisputeFee : Brehon -> Wei -> Brehon
updateBrehonDisputeFee brehon disputeFee =
    { brehon | disputeFee = disputeFee }
