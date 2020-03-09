import styles from "*.scss";
export let Elm: { Main: Main };

export interface Main {
  init(options: { node: HTMLElement; flags: Flags }): App;
}

export interface Flags {
  styles: typeof styles;
}

export interface App {}
