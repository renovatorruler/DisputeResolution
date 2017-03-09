module Update exposing (..)

import Msgs exposing (..)
import Models exposing (Model, Address, Wei, Parties, PartyModel, Party, Brehons, BrehonModel, Brehon)
import Commands exposing (..)


update : Msg -> Model -> ( Model, Cmd Msg )
update msg model =
    case msg of
        LoadAccounts accounts ->
            ( setLoadedAddress model (List.head accounts), Cmd.none )

        LoadDeployedAt deployedAddr ->
            ( { model | deployedAt = deployedAddr }, Cmd.none )

        LoadAllParties parties ->
            ( { model
                | partyA = updatePartyModel model.partyA parties.partyA
                , partyB = updatePartyModel model.partyB parties.partyB
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

        AcceptContractByParty party ->
            ( model, acceptContractByParty party )

        AcceptContractByBrehon brehon ->
            ( model, acceptContractByBrehon brehon )

        DepositFieldChanged amount ->
            ( { model | partyA = updatePartyDepositField model.partyA amount }, Cmd.none )

        DepositFunds party ->
            ( model, consoleLog party.depositField )

        None ->
            ( model, Cmd.none )


setLoadedAddress : Model -> Maybe Address -> Model
setLoadedAddress model address =
    case address of
        Nothing ->
            model

        Just addr ->
            { model | loadedAccount = addr }


updatePartyModel : PartyModel -> Party -> PartyModel
updatePartyModel partyModel party =
    { partyModel | struct = party }


updateBrehonModel : BrehonModel -> Brehon -> BrehonModel
updateBrehonModel brehonModel brehon =
    { brehonModel | struct = brehon }


updatePartyDepositField : PartyModel -> Wei -> PartyModel
updatePartyDepositField partyModel amount =
    { partyModel | depositField = amount }
