module Main exposing (main)

import Browser
import Html as H exposing (Html)
import Html.Attributes as A


type alias Styles =
    { medium : String
    , big : String
    , parcel : String
    , typescript : String
    , cssModules : String
    , elm : String
    }


type alias Flags =
    { styles : Styles }


type alias Model =
    { styles : Styles }


main : Program Flags Model msg
main =
    Browser.element
        { init = init
        , view = view
        , update = \_ model -> ( model, Cmd.none )
        , subscriptions = \_ -> Sub.none
        }


init : Flags -> ( Model, Cmd msg )
init flags =
    ( Model flags.styles, Cmd.none )


view : Model -> Html msg
view model =
    let
        style prop =
            A.class <| prop model.styles
    in
    H.div []
        [ H.p [ style .big ]
            [ H.span [ style .cssModules ]
                [ H.text "CSS modules" ]
            , H.text " in "
            , H.span [ style .elm ]
                [ H.text "Elm" ]
            , H.text "!"
            ]
        , H.p [ style .medium ]
            [ H.text "Glued with "
            , H.span [ style .typescript ]
                [ H.text "TypeScript" ]
            , H.text " & "
            , H.span [ style .parcel ]
                [ H.text "Parcel" ]
            , H.text "."
            ]
        ]
