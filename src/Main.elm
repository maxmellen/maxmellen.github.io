port module Main exposing (main)

import Browser
import Html as H exposing (Html)
import Html.Attributes as A
import Html.Events as E
import Json.Decode as J


type alias Flags =
    { deviceWidth : Int }


type alias Model =
    { deviceCategory : DeviceCategory }


type Msg
    = NoOp
    | Alert String
    | GetWindowSize
    | Resize Int


type DeviceCategory
    = Phone
    | Tablet
    | Desktop


main : Program Flags Model Msg
main =
    Browser.element
        { init = init
        , view = view
        , update = update
        , subscriptions = subscriptions
        }


init : Flags -> ( Model, Cmd Msg )
init flags =
    ( { deviceCategory = computeDeviceCategory flags.deviceWidth }, Cmd.none )


view : Model -> Html Msg
view model =
    let
        fontSize =
            case model.deviceCategory of
                Phone ->
                    "18pt"

                Tablet ->
                    "24pt"

                Desktop ->
                    "36pt"

        bigParagraph =
            styled H.p
                [ ( "font-size", fontSize )
                , ( "text-align", "center" )
                , ( "text-shadow", "0 3px 6px #00000022" )
                ]

        elmSpan =
            styled H.span
                [ ( "font-weight", "500" )
                , ( "text-decoration", "underline" )
                , ( "color", "#a6fcda" )
                ]
    in
    bigParagraph [ E.onClick <| Alert "I said hey!" ]
        [ H.text "And welcome to "
        , elmSpan [] [ H.text "Elm" ]
        , H.text "!"
        ]


update : Msg -> Model -> ( Model, Cmd Msg )
update msg model =
    case msg of
        NoOp ->
            ( model, Cmd.none )

        Alert message ->
            ( model, alert message )

        GetWindowSize ->
            ( model, Cmd.none )

        Resize width ->
            ( { model | deviceCategory = computeDeviceCategory width }, Cmd.none )


subscriptions : Model -> Sub Msg
subscriptions _ =
    windowResize <|
        J.decodeValue (J.field "width" J.int)
            >> Result.map Resize
            >> Result.withDefault NoOp


styled : (List (H.Attribute msg) -> List (Html msg) -> Html msg) -> List ( String, String ) -> List (H.Attribute msg) -> List (Html msg) -> Html msg
styled element stylePairs otherAttrs =
    let
        styleAttrs =
            List.map (\( name, value ) -> A.style name value) stylePairs
    in
    element <| styleAttrs ++ otherAttrs


computeDeviceCategory : Int -> DeviceCategory
computeDeviceCategory deviceWidth =
    case compare deviceWidth 400 of
        LT ->
            Phone

        _ ->
            case compare deviceWidth 600 of
                LT ->
                    Tablet

                _ ->
                    Desktop


port alert : String -> Cmd msg


port windowResize : (J.Value -> msg) -> Sub msg
