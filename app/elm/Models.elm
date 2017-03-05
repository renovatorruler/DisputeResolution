module Models exposing (..)


type alias Model =
    { partyA : Party
    , partyB : Party
    }


type alias Party =
    { profileImage : FilePath
    , addr : Address
    , deposit : Int
    , contractAccepted : Bool
    }


type alias Address =
    String


type alias FilePath =
    String
