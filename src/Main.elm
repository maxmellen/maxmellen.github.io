port module Main exposing (main)

import Browser
import Html as H exposing (Html)
import Html.Attributes as A
import Html.Events as E
import Styles


type alias Flags =
    ()


type alias Model =
    ()


type Msg
    = NoOp
    | Alert String


main : Program Flags Model Msg
main =
    Browser.element
        { init = init
        , view = view
        , update = update
        , subscriptions = \_ -> Sub.none
        }


init : Flags -> ( Model, Cmd Msg )
init _ =
    ( (), Cmd.none )


view : Model -> Html Msg
view _ =
    H.p [ A.class Styles.big, E.onClick <| Alert "I said hey!" ]
        [ H.text "And welcome to "
        , H.span [ A.class Styles.elm ] [ H.text "Elm" ]
        , H.text "!"
        ]


update : Msg -> Model -> ( Model, Cmd Msg )
update msg model =
    case msg of
        NoOp ->
            ( model, Cmd.none )

        Alert message ->
            ( model, alert message )


port alert : String -> Cmd msg
