module Models exposing (..)


zeroWei : Wei
zeroWei =
    "0"


initContractInfo : ContractInfo
initContractInfo =
    ContractInfo Nothing Negotiation zeroWei False False Nothing


type alias Model =
    { contractInfo : ContractInfo
    , loadedAccount : Address
    , depositField : Wei
    , totalDeposits : Wei
    , settlementPartyAField : Wei
    , settlementPartyBField : Wei
    , partyA : PartyModel
    , partyB : PartyModel
    , primaryBrehon : BrehonModel
    , secondaryBrehon : BrehonModel
    , tertiaryBrehon : BrehonModel
    }


type alias ContractInfo =
    { deployedAt : Address
    , stage : Stage
    , transactionAmount : Wei
    , partiesAccepted : Bool
    , brehonsAccepted : Bool
    , proposedSettlement : Maybe Settlement
    }


type alias Settlement =
    { party : PartyModel
    , settlementPartyA : Wei
    , settlementPartyB : Wei
    }


type alias PartyModel =
    { struct : Party
    }


type alias BrehonModel =
    { struct : Brehon
    }


type alias Party =
    { addr : Address
    , deposit : Wei
    , contractAccepted : Bool
    }


type alias Brehon =
    { addr : Address
    , contractAccepted : Bool
    }


type alias Address =
    Maybe String


type alias FilePath =
    String


type alias Wei =
    String


type alias Parties =
    { partyA : Party
    , partyB : Party
    , totalDeposits : Wei
    }


type alias Brehons =
    { primaryBrehon : Brehon
    , secondaryBrehon : Brehon
    , tertiaryBrehon : Brehon
    }


type Stage
    = Negotiation
    | Execution
    | Dispute
    | Resolved
    | AppealPeriod
    | Appeal
    | Completed
