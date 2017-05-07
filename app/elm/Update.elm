module Update exposing (..)

import Tuple exposing (first, second)
import Msgs exposing (..)
import Contract.Update exposing (updateContract)
import Models exposing (Model, ContractCreatorModel, ContractModel, Stage(..), Event(..), ContractInfo, Settlement, Awards, Address, Wei, zeroWei, Parties, PartyModel, Party, Brehons, BrehonModel, Brehon)
import UrlParser as Url exposing (..)
import UrlParsing exposing (route)


update : Msg -> Model -> ( Model, Cmd Msg )
update msg model =
    let
        updatedContractMsg =
            updateContract msg model.contractModel
    in
        case msg of
            UrlChange location ->
                let
                    nextRoute =
                        Url.parseHash route location
                in
                    { model
                        | history = nextRoute :: model.history
                        , currentRoute = nextRoute
                    }
                        ! []

            {- This Horrible pattern (where I repeat these case handling here and
               in updateContract method) exists because I want compiler to catch
               any new Msgs added. In future maybe this can be refactored.
            -}
            LoadAccounts accounts ->
                ( { model | contractModel = first updatedContractMsg }, second updatedContractMsg )

            LoadContractInfo ( deployedAddr, stage, transactionAmount, minimumContractAmt, appealPeriodInDays, activeBrehon, awards ) ->
                ( { model | contractModel = first updatedContractMsg }, second updatedContractMsg )

            LoadAllParties parties ->
                ( { model | contractModel = first updatedContractMsg }, second updatedContractMsg )

            LoadAllBrehons brehons ->
                ( { model | contractModel = first updatedContractMsg }, second updatedContractMsg )

            AcceptContractByParty partyModel ->
                ( { model | contractModel = first updatedContractMsg }, second updatedContractMsg )

            AcceptContractByBrehon brehonModel ->
                ( { model | contractModel = first updatedContractMsg }, second updatedContractMsg )

            DepositFieldChanged amount ->
                ( { model | contractModel = first updatedContractMsg }, second updatedContractMsg )

            DepositFunds partyModel ->
                ( { model | contractModel = first updatedContractMsg }, second updatedContractMsg )

            SettlementPartyAFieldChanged amount ->
                ( { model | contractModel = first updatedContractMsg }, second updatedContractMsg )

            SettlementPartyBFieldChanged amount ->
                ( { model | contractModel = first updatedContractMsg }, second updatedContractMsg )

            StartContract partyModel ->
                ( { model | contractModel = first updatedContractMsg }, second updatedContractMsg )

            LoadProposedSettlement proposedSettlement ->
                ( { model | contractModel = first updatedContractMsg }, second updatedContractMsg )

            LoadAwards awards ->
                ( { model | contractModel = first updatedContractMsg }, second updatedContractMsg )

            ProposeSettlement partyModel ->
                ( { model | contractModel = first updatedContractMsg }, second updatedContractMsg )

            AcceptSettlement partyModel ->
                ( { model | contractModel = first updatedContractMsg }, second updatedContractMsg )

            LoadAllEvents ->
                ( { model | contractModel = first updatedContractMsg }, second updatedContractMsg )

            LoadExecutionStartedEvent ( blockNumber, txHash, caller, totalDeposits ) ->
                ( { model | contractModel = first updatedContractMsg }, second updatedContractMsg )

            LoadSettlementProposedEvent ( blockNumber, txHash, proposingParty, awardPartyA, awardPartyB ) ->
                ( { model | contractModel = first updatedContractMsg }, second updatedContractMsg )

            LoadDisputeResolvedEvent ( blockNumber, txHash, awardPartyA, awardPartyB ) ->
                ( { model | contractModel = first updatedContractMsg }, second updatedContractMsg )

            LoadContractDisputedEvent ( disputingParty, activeBrehon ) ->
                ( { model | contractModel = first updatedContractMsg }, second updatedContractMsg )

            LoadAppealPeriodStartedEvent ( startTime, activeBrehon, awardPartyA, awardPartyB ) ->
                ( { model | contractModel = first updatedContractMsg }, second updatedContractMsg )

            LoadAppealRaisedEvent ( appealingParty, activeBrehon ) ->
                ( { model | contractModel = first updatedContractMsg }, second updatedContractMsg )

            LoadSecondAppealRaisedEvent ( appealingParty, activeBrehon ) ->
                ( { model | contractModel = first updatedContractMsg }, second updatedContractMsg )

            LoadFundsClaimed ( claimingParty, amount ) ->
                ( { model | contractModel = first updatedContractMsg }, second updatedContractMsg )

            UpdateTimestamp time ->
                ( { model | contractModel = first updatedContractMsg }, second updatedContractMsg )

            RaiseDispute addr ->
                ( { model | contractModel = first updatedContractMsg }, second updatedContractMsg )

            RaiseAppeal addr ->
                ( { model | contractModel = first updatedContractMsg }, second updatedContractMsg )

            RaiseSecondAppeal addr ->
                ( { model | contractModel = first updatedContractMsg }, second updatedContractMsg )

            Adjudicate brehonModel ->
                ( { model | contractModel = first updatedContractMsg }, second updatedContractMsg )

            WithdrawFunds addr ->
                ( { model | contractModel = first updatedContractMsg }, second updatedContractMsg )

            None ->
                ( model, Cmd.none )
