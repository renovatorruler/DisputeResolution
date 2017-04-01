module Update exposing (..)

import Msgs exposing (..)
import Time.DateTime as DateTime exposing (DateTime, dateTime, zero, fromISO8601)
import Models exposing (Model, Stage(..), Event(..), ContractInfo, Settlement, Awards, Address, Wei, zeroWei, Parties, PartyModel, Party, Brehons, BrehonModel, Brehon)
import Commands exposing (..)


update : Msg -> Model -> ( Model, Cmd Msg )
update msg model =
    case msg of
        LoadAccounts accounts ->
            ( setLoadedAddress model (List.head accounts), Cmd.none )

        LoadContractInfo ( deployedAddr, stage, transactionAmount, minimumContractAmt, activeBrehon, awards ) ->
            ( { model
                | contractInfo = updateContractInfo model.contractInfo deployedAddr stage transactionAmount minimumContractAmt activeBrehon awards
              }
            , Cmd.none
            )

        LoadAllParties parties ->
            ( { model
                | partyA = updatePartyModel model.partyA parties.partyA
                , partyB = updatePartyModel model.partyB parties.partyB
                , totalDeposits = parties.totalDeposits
                , depositField = zeroWei
                , contractInfo =
                    getPartiesAcceptance parties
                        |> updatePartyAcceptance model.contractInfo
              }
            , Cmd.none
            )

        LoadAllBrehons brehons ->
            ( { model
                | primaryBrehon = updateBrehonModel model.primaryBrehon brehons.primaryBrehon
                , secondaryBrehon = updateBrehonModel model.secondaryBrehon brehons.secondaryBrehon
                , tertiaryBrehon = updateBrehonModel model.tertiaryBrehon brehons.tertiaryBrehon
                , contractInfo =
                    getBrehonsAcceptance brehons
                        |> updateBrehonAcceptance model.contractInfo
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

        SettlementPartyAFieldChanged amount ->
            ( { model | settlementPartyAField = amount }, Cmd.none )

        SettlementPartyBFieldChanged amount ->
            ( { model | settlementPartyBField = amount }, Cmd.none )

        StartContract party ->
            ( model, startContract party.struct.addr )

        LoadProposedSettlement proposedSettlement ->
            ( { model | contractInfo = updateContractInfoSettlement model.contractInfo proposedSettlement }, Cmd.none )

        LoadAwards awards ->
            ( { model | contractInfo = updateAwards model.contractInfo awards }, Cmd.none )

        ProposeSettlement party ->
            ( model, proposeSettlement party.struct.addr model.settlementPartyAField model.settlementPartyBField )

        AcceptSettlement party ->
            case model.contractInfo.proposedSettlement of
                Nothing ->
                    ( model, Cmd.none )

                Just settlement ->
                    ( model
                    , acceptSettlement
                        party.struct.addr
                        settlement.settlementPartyA
                        settlement.settlementPartyB
                    )

        LoadAllEvents ->
            ( model, Cmd.none )

        LoadExecutionStartedEvent ( blockNumber, txHash, caller, totalDeposits ) ->
            ( { model
                | eventLog =
                    ExecutionStartedEvent blockNumber
                        txHash
                        caller
                        totalDeposits
                        :: model.eventLog
              }
            , Cmd.none
            )

        LoadSettlementProposedEvent ( blockNumber, txHash, proposingParty, awardPartyA, awardPartyB ) ->
            ( { model
                | eventLog =
                    SettlementProposedEvent blockNumber
                        txHash
                        proposingParty
                        awardPartyA
                        awardPartyB
                        :: model.eventLog
              }
            , Cmd.none
            )

        LoadDisputeResolvedEvent ( blockNumber, txHash, awardPartyA, awardPartyB ) ->
            ( { model
                | eventLog =
                    DisputeResolvedEvent blockNumber
                        txHash
                        awardPartyA
                        awardPartyB
                        :: model.eventLog
              }
            , Cmd.none
            )

        LoadContractDisputedEvent ( disputingParty, activeBrehon ) ->
            ( { model
                | eventLog =
                    ContractDisputedEvent disputingParty
                        activeBrehon
                        :: model.eventLog
              }
            , Cmd.none
            )

        LoadAppealPeriodStartedEvent ( appealLevel, startTime, activeBrehon, awardPartyA, awardPartyB ) ->
            ( { model
                | eventLog =
                    AppealPeriodStartedEvent appealLevel
                        (toDateTime startTime)
                        activeBrehon
                        awardPartyA
                        awardPartyB
                        :: model.eventLog
                , primaryBrehon = updateBrehonAwards model.primaryBrehon activeBrehon awardPartyA awardPartyB
                , secondaryBrehon = updateBrehonAwards model.secondaryBrehon activeBrehon awardPartyA awardPartyB
                , contractInfo = updateAppealPeriodStart model.contractInfo (toDateTime startTime)
              }
            , Cmd.none
            )

        LoadFundsClaimed ( claimingParty, amount ) ->
            ( { model
                | eventLog =
                    FundsClaimedEvent claimingParty
                        amount
                        :: model.eventLog
              }
            , Cmd.none
            )

        Adjudicate brehon ->
            ( model, adjudicate brehon.struct.addr model.settlementPartyAField model.settlementPartyBField )

        WithdrawFunds addr ->
            ( model, withdrawFunds addr )

        RaiseDispute addr ->
            ( model, raiseDispute addr )

        None ->
            ( model, Cmd.none )


getPartiesAcceptance : Parties -> Bool
getPartiesAcceptance parties =
    List.all (\p -> p.contractAccepted)
        [ parties.partyA
        , parties.partyB
        ]


getBrehonsAcceptance : Brehons -> Bool
getBrehonsAcceptance brehons =
    List.all (\b -> b.contractAccepted)
        [ brehons.primaryBrehon
        , brehons.secondaryBrehon
        , brehons.tertiaryBrehon
        ]


setLoadedAddress : Model -> Maybe Address -> Model
setLoadedAddress model address =
    case address of
        Nothing ->
            model

        Just addr ->
            { model | loadedAccount = addr }


updatePartyAcceptance : ContractInfo -> Bool -> ContractInfo
updatePartyAcceptance contractInfo partiesAccepted =
    { contractInfo | partiesAccepted = partiesAccepted }


updateBrehonAcceptance : ContractInfo -> Bool -> ContractInfo
updateBrehonAcceptance contractInfo brehonsAccepted =
    { contractInfo | brehonsAccepted = brehonsAccepted }


updateContractInfoSettlement : ContractInfo -> Maybe Settlement -> ContractInfo
updateContractInfoSettlement contractInfo settlement =
    { contractInfo | proposedSettlement = settlement }


updateAwards : ContractInfo -> Maybe Awards -> ContractInfo
updateAwards contractInfo awards =
    { contractInfo | awards = awards }


updateContractInfo : ContractInfo -> Address -> Int -> Wei -> Wei -> Address -> Maybe Awards -> ContractInfo
updateContractInfo contractInfo addr stageInt transactionAmount minimumContractAmt activeBrehon awards =
    let
        contractInfoUpdated =
            { contractInfo
                | deployedAt = addr
                , transactionAmount = transactionAmount
                , minimumContractAmt = minimumContractAmt
                , activeBrehon = activeBrehon
                , awards = awards
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


updateBrehonAwards : BrehonModel -> Address -> Wei -> Wei -> BrehonModel
updateBrehonAwards brehonModel activeBrehonAddr awardPartyA awardPartyB =
    if brehonModel.struct.addr == activeBrehonAddr then
        { brehonModel | awards = Just (Awards awardPartyA awardPartyB) }
    else
        brehonModel


updateAppealPeriodStart : ContractInfo -> DateTime -> ContractInfo
updateAppealPeriodStart contractInfo appealPeriodStart =
    { contractInfo | appealPeriodStart = Just appealPeriodStart }


toDateTime : String -> DateTime
toDateTime dateString =
    case fromISO8601 dateString of
        Err e ->
            dateTime zero

        Ok r ->
            r
