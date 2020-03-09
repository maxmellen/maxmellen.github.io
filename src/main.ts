import styles from "./main.scss";
import { Elm } from "./Main.elm";

Elm.Main.init({
  node: document.getElementById("elm")!,
  flags: { styles }
});
