module Update exposing (..)

import Msgs exposing (..)
import Models exposing (Model, Address, Parties, Brehons)


update : Msg -> Model -> ( Model, Cmd Msg )
update msg model =
    case msg of
        LoadAccounts accounts ->
            ( model, Cmd.none )

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


get : Int -> List x -> Maybe x
get i xs =
    case i of
        0 ->
            List.head xs

        _ ->
            get (i - 1) (List.drop 1 xs)
