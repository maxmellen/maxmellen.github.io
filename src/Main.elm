module Main exposing (main)

import Browser
import Html as H exposing (Html)
import Styles exposing (Helper)


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
    { css : Helper Styles Msg }


type alias Msg =
    ()


main : Program Flags Model Msg
main =
    Browser.element
        { init = init
        , view = view
        , update = \_ model -> ( model, Cmd.none )
        , subscriptions = \_ -> Sub.none
        }


init : Flags -> ( Model, Cmd msg )
init flags =
    let
        styles =
            Styles.helper flags.styles
    in
    ( Model styles, Cmd.none )


view : Model -> Html Msg
view { css } =
    H.div []
        [ H.p [ css.class .big ]
            [ H.span [ css.class .cssModules ]
                [ H.text "CSS modules" ]
            , H.text " in "
            , H.span [ css.class .elm ]
                [ H.text "Elm" ]
            , H.text "!"
            ]
        , H.p [ css.class .medium ]
            [ H.text "Glued with "
            , H.span [ css.class .typescript ]
                [ H.text "TypeScript" ]
            , H.text " & "
            , H.span [ css.class .parcel ]
                [ H.text "Parcel" ]
            , H.text "."
            ]
        ]
