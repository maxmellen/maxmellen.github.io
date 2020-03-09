module Main exposing (main)

import Html as H exposing (Html)
import Html.Attributes as A
import Styles


main : Html msg
main =
    H.p [ A.class Styles.big ]
        [ H.text "Under construction..." ]
