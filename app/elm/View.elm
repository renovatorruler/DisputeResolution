module View exposing (..)

import ViewHelpers exposing (..)
import Html exposing (Html, div, text, label, form, input, textarea, button, a)
import Html.Attributes exposing (class, placeholder, type_, rows, value, href)
import Html.Events exposing (onClick, onInput)
import Msgs exposing (Msg)
import Contract.View exposing (..)
import Models exposing (Model, initContractCreatorModel, ContractCreatorModel, ContractModel, Address, Event(..), ContractInfo, Settlement, Awards, Wei, PartyModel, BrehonModel, FilePath, AppealLevel(..), Stage(..))
import UrlParsing exposing (..)


view : Model -> Html Msg
view model =
    case model.currentRoute of
        Just Create ->
            contractCreatorView model.creatorModel

        Just (Contract contractAddr) ->
            contractView model.contractModel

        Nothing ->
            div [] [ text "Not found 404" ]


contractCreatorView : ContractCreatorModel -> Html Msg
contractCreatorView model =
    div [ class "main-container lg-h4 md-h4 sm-h4 clearfix" ]
        [ div [ class "col-4 mx-auto" ]
            [ form [ class "contract-creator-form" ]
                [ label [ class "label" ] [ text "Party A" ]
                , input
                    [ class "input ethereum-address party-a-addr"
                    , onInput Msgs.PartyAAddrChanged
                    , placeholder "0x00000"
                    , value "0x90f8bf6a479f320ead074411a4b0e7944ea8c9c1"
                    ]
                    []
                , label [ class "label" ] [ text "Party B" ]
                , input
                    [ class "input ethereum-address party-b-addr"
                    , onInput Msgs.PartyBAddrChanged
                    , placeholder "0x00000"
                    , value "0xffcf8fdee72ac11b5c542428b35eef5769c409f0"
                    ]
                    []
                , label [ class "label" ] [ text "Transaction Amount" ]
                , input
                    [ class "input tx-amount"
                    , type_ "number"
                    , placeholder "e.g. 1000 Wei"
                    , onInput Msgs.TxAmountChanged
                    , value "5000"
                    ]
                    []
                , label [ class "label" ] [ text "Terms and Conditions" ]
                , textarea
                    [ class "textarea tx-amount"
                    , rows 6
                    , placeholder "Party A agrees to sell Party B a 1996 Rolex watch for 500 Wei."
                    , onInput Msgs.TermsChanged
                    , value "Party A agrees to sell Party B a 1996 Rolex watch for 500 Wei."
                    ]
                    []
                , div [ class "" ]
                    [ label [ class "label" ] [ text "Primary Brehon" ]
                    , input
                        [ class "input ethereum-address primary-brehon-addr"
                        , placeholder "0x00000"
                        , onInput Msgs.PrimaryBrehonAddrChanged
                        , value "0x22d491bde2303f2f43325b2108d26f1eaba1e32b"
                        ]
                        []
                    , label [ class "label" ] [ text "Fixed Fee" ]
                    , input
                        [ class "input ethereum-address primary-brehon-addr"
                        , placeholder "e.g. 100 Wei"
                        , onInput Msgs.PrimaryBrehonFixedFeeChanged
                        , value "10"
                        ]
                        []
                    , label [ class "label" ] [ text "Dispute Fee" ]
                    , input
                        [ class "input ethereum-address primary-brehon-addr"
                        , placeholder "e.g. 100 Wei"
                        , onInput Msgs.PrimaryBrehonDisputeFeeChanged
                        , value "100"
                        ]
                        []
                    ]
                , div [ class "" ]
                    [ label [ class "label" ] [ text "Secondary Brehon" ]
                    , input
                        [ class "input ethereum-address primary-brehon-addr"
                        , placeholder "0x00000"
                        , onInput Msgs.SecondaryBrehonAddrChanged
                        , value "0xe11ba2b4d45eaed5996cd0823791e0c93114882d"
                        ]
                        []
                    , label [ class "label" ] [ text "Fixed Fee" ]
                    , input
                        [ class "input ethereum-address primary-brehon-addr"
                        , placeholder "e.g. 100 Wei"
                        , onInput Msgs.SecondaryBrehonFixedFeeChanged
                        , value "10"
                        ]
                        []
                    , label [ class "label" ] [ text "Dispute Fee" ]
                    , input
                        [ class "input ethereum-address primary-brehon-addr"
                        , placeholder "e.g. 100 Wei"
                        , onInput Msgs.SecondaryBrehonDisputeFeeChanged
                        , value "100"
                        ]
                        []
                    ]
                , div [ class "" ]
                    [ label [ class "label" ] [ text "Tertiary Brehon" ]
                    , input
                        [ class "input ethereum-address primary-brehon-addr"
                        , placeholder "0x00000"
                        , onInput Msgs.TertiaryBrehonAddrChanged
                        , value "0xd03ea8624c8c5987235048901fb614fdca89b117"
                        ]
                        []
                    , label [ class "label" ] [ text "Fixed Fee" ]
                    , input
                        [ class "input ethereum-address primary-brehon-addr"
                        , placeholder "e.g. 100 Wei"
                        , onInput Msgs.TertiaryBrehonFixedFeeChanged
                        , value "10"
                        ]
                        []
                    , label [ class "label" ] [ text "Dispute Fee" ]
                    , input
                        [ class "input ethereum-address primary-brehon-addr"
                        , placeholder "e.g. 100 Wei"
                        , onInput Msgs.TertiaryBrehonDisputeFeeChanged
                        , value "100"
                        ]
                        []
                    ]
                , a
                    [ class "btn btn-primary"
                    , onClick (Msgs.CreateContract model)

                    --, href ("#contract/" ++ toJustString identity model.partyA)
                    ]
                    [ text "Create"
                    ]
                ]
            ]
        ]
