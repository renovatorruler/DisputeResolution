module Models exposing (..)


type alias Model =
    { partyA : Party
    , partyB : Party
    , primaryBrehon : Brehon
    , secondaryBrehon : Brehon
    , tertiaryBrehon : Brehon
    }


type alias Party =
    { profileImage : FilePath
    , addr : Address
    , deposit : Int
    , contractAccepted : Bool
    }


type alias Brehon =
    { profileImage : FilePath
    , addr : Address
    , contractAccepted : Bool
    }


type alias Address =
    String


type alias FilePath =
    String
