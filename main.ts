import styles from "./main.scss";
import { Elm } from "./Main.elm";

interface Greetings {
  phrase: string;
  technology: string;
  color: string;
}

let greetings: Greetings[] = [
  {
    phrase: "Hello",
    technology: "Parcel",
    color: styles.parcel
  },
  {
    phrase: "Oh hi",
    technology: "TypeScript",
    color: styles.typescript
  },
  {
    phrase: "Helllooo",
    technology: "CSS modules",
    color: styles.cssModules
  }
];

interface ElmInit {
  flags: { deviceWidth: number };
  ports: {
    outgoing: "alert" | "getWindowSize";
    incoming: "windowResize";
  };
}

let punctuation: string[] = [",", "...", "!"];

let paragraphs: HTMLParagraphElement[] = greetings.map((g, i) => {
  let p = document.createElement("p");
  let span = document.createElement("span");
  span.textContent = g.technology;
  span.className = g.color;
  p.append(`${g.phrase}, `);
  p.append(span);
  p.append(punctuation[i]);
  p.className = styles.big;
  return p;
});

window.addEventListener("load", () => {
  paragraphs.forEach(p => {
    document.body.append(p);
  });

  const elmDiv = document.createElement("div");
  document.body.append(elmDiv);

  let app = Elm.Main!.init<ElmInit>({
    node: elmDiv,
    flags: { deviceWidth: window.innerWidth }
  });

  app.ports.alert.subscribe((message: string) => {
    window.alert(message);
  });

  window.addEventListener("resize", () => {
    app.ports.windowResize.send({ width: window.innerWidth });
  });
});
