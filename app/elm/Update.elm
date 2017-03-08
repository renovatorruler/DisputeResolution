module Update exposing (..)

import Msgs exposing (..)
import Models exposing (Model, Address, Parties, Brehons)
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
                | partyA = parties.partyA
                , partyB = parties.partyB
              }
            , Cmd.none
            )

        LoadAllBrehons brehons ->
            ( { model
                | primaryBrehon = brehons.primaryBrehon
                , secondaryBrehon = brehons.secondaryBrehon
                , tertiaryBrehon = brehons.tertiaryBrehon
              }
            , Cmd.none
            )

        AcceptContractByParty party ->
            ( model, acceptContractByParty party )

        AcceptContractByBrehon brehon ->
            ( model, acceptContractByBrehon brehon )


setLoadedAddress : Model -> Maybe Address -> Model
setLoadedAddress model address =
    case address of
        Nothing ->
            model

        Just addr ->
            { model | loadedAccount = addr }
