module Models exposing (..)


type alias Model =
    { deployedAt : Address
    , loadedAccount : Address
    , partyA : PartyModel
    , partyB : PartyModel
    , primaryBrehon : BrehonModel
    , secondaryBrehon : BrehonModel
    , tertiaryBrehon : BrehonModel
    }


type alias PartyModel =
    { struct : Party
    , depositField : Wei
    }


type alias BrehonModel =
    { struct : Brehon
    }


type alias Party =
    { addr : Address
    , deposit : Int
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
    }


type alias Brehons =
    { primaryBrehon : Brehon
    , secondaryBrehon : Brehon
    , tertiaryBrehon : Brehon
    }
