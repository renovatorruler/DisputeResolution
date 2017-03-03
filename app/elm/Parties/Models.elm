module Models exposing (..)

type alias Party =
  {
    addr : String
  , deposit : Int
  , contractAccepted : Bool
  }

partyA : Model
partyB =
  { 
