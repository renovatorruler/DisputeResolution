module Commands exposing (..)

import Models exposing (Address, PartyModel, BrehonModel)
import Msgs exposing (Msg)
import Web3.BrehonAPI exposing (..)


loadWeb3Accounts : Cmd Msg
loadWeb3Accounts =
    requestAccounts 0


loadContractInfo : Cmd Msg
loadContractInfo =
    requestContractInfo 0


loadAllParties : Cmd Msg
loadAllParties =
    requestAllParties 0


loadAllBrehons : Cmd Msg
loadAllBrehons =
    requestAllBrehons 0


acceptContractByParty : PartyModel -> Cmd Msg
acceptContractByParty party =
    requestAcceptContractByParty party.struct


acceptContractByBrehon : BrehonModel -> Cmd Msg
acceptContractByBrehon brehon =
    requestAcceptContractByBrehon brehon.struct


depositFunds : PartyModel -> String -> Cmd Msg
depositFunds partyModel amount =
    requestDepositFunds ( partyModel, amount )



{- For Debugging purposes -}


consoleLog : String -> Cmd Msg
consoleLog msg =
    requestConsoleLog msg
