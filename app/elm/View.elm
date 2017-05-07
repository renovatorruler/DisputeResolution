module View exposing (..)

import Html exposing (Html, div, text)
import Html.Attributes exposing (class)
import Msgs exposing (Msg)
import Contract.View exposing (..)
import Models exposing (Model, ContractCreatorModel, ContractModel, Address, Event(..), ContractInfo, Settlement, Awards, Wei, PartyModel, BrehonModel, FilePath, AppealLevel(..), Stage(..))
import UrlParsing exposing (..)


view : Model -> Html Msg
view model =
    case model.currentRoute of
        Just Create ->
            contractCreatorView model.creatorModel

        Just Contract ->
            contractView model.contractModel

        Nothing ->
            div [] [ text "Not found 404" ]


contractCreatorView : ContractCreatorModel -> Html Msg
contractCreatorView model =
    div [ class "main-container lg-h4 md-h4 sm-h4 clearfix" ]
        [ text "contractCreatorView" ]
