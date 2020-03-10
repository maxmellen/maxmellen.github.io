module Styles exposing (Helper, helper)

import Html as H
import Html.Attributes as A


type alias Helper styles msg =
    { class : (styles -> String) -> H.Attribute msg
    , classList : List ( styles -> String, Bool ) -> H.Attribute msg
    }


helper : styles -> Helper styles msg
helper styles =
    { class =
        \accessor ->
            A.class <| accessor styles
    , classList =
        A.class
            << String.join " "
            << List.map (\( accessor, _ ) -> accessor styles)
            << List.filter (\( _, active ) -> active)
    }
