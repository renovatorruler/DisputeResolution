module Parties.Models exposing (..)

type alias Party =
  {
    profileImage : FilePath
  , addr : Address
  , deposit : Int
  , contractAccepted : Bool
  }

partyA : Party
partyA = Party "" "" 0 False

type alias Address =
  String

type alias FilePath =
  String
