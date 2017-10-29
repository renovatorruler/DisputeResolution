module UrlParsing exposing (..)

import UrlParser as Url exposing (..)


type Route
    = Create
    | Contract String


route : Url.Parser (Route -> a) a
route =
    Url.oneOf
        [ Url.map Create top
        , Url.map Contract (s "contract" </> string)
        ]
