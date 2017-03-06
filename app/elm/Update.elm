module Update exposing (..)

import Msgs exposing (..)
import Models exposing (Model, Address, Party, Brehon)


update : Msg -> Model -> ( Model, Cmd Msg )
update msg model =
    case msg of
        LoadAccounts accounts ->
            ( model, Cmd.none )

        LoadDeployedAt deployedAddr ->
            ( { model | deployedAt = deployedAddr }, Cmd.none )

        LoadAllAddresses addresses ->
            ( { model
                | partyA = updatePartyAddr model.partyA (get 0 addresses)
                , partyB = updatePartyAddr model.partyB (get 1 addresses)
                , primaryBrehon = updateBrehonAddr model.primaryBrehon (get 2 addresses)
                , secondaryBrehon = updateBrehonAddr model.secondaryBrehon (get 3 addresses)
                , tertiaryBrehon = updateBrehonAddr model.tertiaryBrehon (get 4 addresses)
              }
            , Cmd.none
            )


get : Int -> List x -> Maybe x
get i xs =
    case i of
        0 ->
            List.head xs

        _ ->
            get (i - 1) (List.drop 1 xs)


updatePartyAddr : Party -> Maybe Address -> Party
updatePartyAddr party newAddr =
    case newAddr of
        Nothing ->
            party

        Just newAddr ->
            { party | addr = newAddr }


updateBrehonAddr : Brehon -> Maybe Address -> Brehon
updateBrehonAddr brehon newAddr =
    case newAddr of
        Nothing ->
            brehon

        Just newAddr ->
            { brehon | addr = newAddr }
