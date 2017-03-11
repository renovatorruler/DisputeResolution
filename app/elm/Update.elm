module Update exposing (..)

import Msgs exposing (..)
import Models exposing (Model, Stage(..), ContractInfo, Address, Wei, zeroWei, Parties, PartyModel, Party, Brehons, BrehonModel, Brehon)
import Commands exposing (..)


update : Msg -> Model -> ( Model, Cmd Msg )
update msg model =
    case msg of
        LoadAccounts accounts ->
            ( setLoadedAddress model (List.head accounts), Cmd.none )

        LoadContractInfo ( deployedAddr, stage, transactionAmount ) ->
            ( { model
                | contractInfo = updateContractInfo model.contractInfo deployedAddr stage transactionAmount
              }
            , Cmd.none
            )

        LoadAllParties parties ->
            ( { model
                | partyA = updatePartyModel model.partyA parties.partyA
                , partyB = updatePartyModel model.partyB parties.partyB
                , totalDeposits = parties.totalDeposits
                , depositField = zeroWei
              }
            , Cmd.none
            )

        LoadAllBrehons brehons ->
            ( { model
                | primaryBrehon = updateBrehonModel model.primaryBrehon brehons.primaryBrehon
                , secondaryBrehon = updateBrehonModel model.secondaryBrehon brehons.secondaryBrehon
                , tertiaryBrehon = updateBrehonModel model.tertiaryBrehon brehons.tertiaryBrehon
              }
            , Cmd.none
            )

        AcceptContractByParty partyModel ->
            ( model, acceptContractByParty partyModel )

        AcceptContractByBrehon brehonModel ->
            ( model, acceptContractByBrehon brehonModel )

        DepositFieldChanged amount ->
            ( { model | depositField = amount }, Cmd.none )

        DepositFunds partyModel ->
            ( model, depositFunds partyModel model.depositField )

        None ->
            ( model, Cmd.none )


setLoadedAddress : Model -> Maybe Address -> Model
setLoadedAddress model address =
    case address of
        Nothing ->
            model

        Just addr ->
            { model | loadedAccount = addr }


updateContractInfo : ContractInfo -> Address -> Int -> Wei -> ContractInfo
updateContractInfo contractInfo addr stageInt transactionAmount =
    let
        contractInfoUpdated =
            { contractInfo
                | deployedAt = addr
                , transactionAmount = transactionAmount
            }
    in
        case stageInt of
            1 ->
                { contractInfoUpdated | stage = Execution }

            2 ->
                { contractInfoUpdated | stage = Dispute }

            3 ->
                { contractInfoUpdated | stage = Resolved }

            4 ->
                { contractInfoUpdated | stage = AppealPeriod }

            5 ->
                { contractInfoUpdated | stage = Appeal }

            6 ->
                { contractInfoUpdated | stage = Completed }

            _ ->
                { contractInfoUpdated | stage = Negotiation }


updatePartyModel : PartyModel -> Party -> PartyModel
updatePartyModel partyModel party =
    { partyModel | struct = party }


updateBrehonModel : BrehonModel -> Brehon -> BrehonModel
updateBrehonModel brehonModel brehon =
    { brehonModel | struct = brehon }
