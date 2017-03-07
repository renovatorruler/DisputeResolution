module Models exposing (..)


type alias Model =
    { deployedAt : Address
    , partyA : Party
    , partyB : Party
    , primaryBrehon : Brehon
    , secondaryBrehon : Brehon
    , tertiaryBrehon : Brehon
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


type alias Parties =
    { partyA : Party
    , partyB : Party
    }


type alias Brehons =
    { primaryBrehon : Brehon
    , secondaryBrehon : Brehon
    , tertiaryBrehon : Brehon
    }
